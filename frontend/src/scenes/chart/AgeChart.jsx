import React, { useState, useEffect } from "react";
import { fetchAgeChart } from "../../API/api";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ExportButton } from "./QuestionChart";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  Button, 
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";
import { tokens } from "../../styles/theme";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export const AgeChart = () => {
  const [data, setData] = useState([]);
  const [chartView, setChartView] = useState('count');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAgeChart();
        if (!res.ok || res.status !== 200) throw new Error("Server error");
        const json = await res.json();
        setData(json);
        localStorage.setItem("ageData", JSON.stringify(json));
      } catch (err) {
        console.error("Front-back error:", err.message);
      }
    };
    fetchData();
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper function for text color
  const getTextColor = () => theme.palette.mode === "dark" ? colors.grey[100] : "#000000";

  // Palette cohérente pour chaque groupe d'âge
  const ageColors = [
    "#2563eb", // bleu pour 18-25
    "#eab308", // jaune pour 26-35
    "#16a34a", // vert pour 36-45
    "#e53935", // rouge pour 46-55
    "#9333ea", // violet pour 56-65
  ];

  const valueKeys = [
    "age entre 18 et 25",
    "age entre 26 et 35",
    "age entre 36 et 45",
    "age entre 46 et 55",
    "age entre 56 et 65",
  ];
  
  const percentKeys = ["18-25", "26-35", "36-45", "46-55", "56-65"];
  const npsKeys = ["nps_18_25", "nps_26_35", "nps_36_45", "nps_46_55", "nps_56_65"];

  const labels = percentKeys;
  const values = chartView === 'count' 
    ? valueKeys.map((k) => data[k] || 0)
    : npsKeys.map((k) => data[k] || 0);

  const barchart = {
    labels,
    datasets: [
      {
        label: chartView === 'count' 
          ? "Customer Count by Age Group"
          : "NPS Score by Age Group",
        data: values,
        backgroundColor: ageColors,
        borderColor: ageColors,
        borderWidth: 2,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: {
          color: getTextColor(),
        }
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "rgba(255, 255, 255, 0.95)",
        titleColor: getTextColor(),
        bodyColor: getTextColor(),
        borderColor: theme.palette.mode === "dark" ? colors.primary[300] : colors.grey[300],
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (chartView === 'nps') {
              return `NPS Score: ${value !== null ? value.toFixed(1) : 'N/A'}`;
            }
            return `Count: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getTextColor(),
          ...(chartView === 'nps' && {
            callback: function(value) {
              return value + '%';
            }
          })
        },
        grid: {
          display: false, // Remove grid lines
        },
        ...(chartView === 'nps' && {
          min: -100,
          max: 100,
        })
      },
      x: {
        ticks: {
          maxRotation: 45,
          color: getTextColor(),
        },
        grid: {
          display: false, // Remove grid lines
        }
      }
    }
  };

  const doughnutLabels = percentKeys;
  const doughnutValues = valueKeys.map((k) => data[k] || 0);

  const cercleChart = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        backgroundColor: ageColors,
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };
  
  const cerclechartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { 
          boxHeight: 20, 
          padding: 20,
          usePointStyle: true,
          color: getTextColor(),
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "rgba(255, 255, 255, 0.95)",
        titleColor: getTextColor(),
        bodyColor: getTextColor(),
        borderColor: theme.palette.mode === "dark" ? colors.primary[300] : colors.grey[300],
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Helper function to get NPS status
  const getNpsStatus = (score) => {
    if (score === null || score === undefined) return { label: 'N/A', color: 'default' };
    if (score >= 50) return { label: 'Excellent', color: 'success' };
    if (score >= 0) return { label: 'Good', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
  };

  // Prepare rows for export & table - include NPS data
  const rows = percentKeys.map((key, index) => ({
    "Age Group": key,
    Count: data[valueKeys[index]] || 0,
    Percentage: data[key] ? `${data[key].toFixed(1)}%` : "0%",
    "NPS Score": data[npsKeys[index]] !== null && data[npsKeys[index]] !== undefined 
      ? data[npsKeys[index]].toFixed(1) 
      : "N/A",
  }));

  const handleExcelExport = () =>
    exportToExcel({
      rows,
      sheetName: "AgeChart",
      fileName: "age_chart_data.xlsx",
    });
    
  const handlePdfExport = () =>
    exportChartDataToPdf({
      rows,
      title: "Age Chart Data with NPS Scores",
      fileName: "age_chart_data.pdf",
    });

  return (
    <Box m="20px">
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "16px",
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h2" color={getTextColor()}>
            AGE GROUP ANALYSIS
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <ExportButton
              handleExcelExport={handleExcelExport}
              handlePdfExport={handlePdfExport}
            />
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Charts Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          {/* Bar Chart with Toggle */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderRadius: "16px",
              p: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h5" fontWeight="bold" color={getTextColor()}>
                Age Group Distribution
              </Typography>
              <ToggleButtonGroup
                value={chartView}
                exclusive
                onChange={(event, newView) => {
                  if (newView !== null) {
                    setChartView(newView);
                  }
                }}
                aria-label="Chart view toggle"
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: getTextColor(),
                    borderColor: theme.palette.mode === "dark" ? colors.grey[600] : colors.grey[400],
                    '&.Mui-selected': {
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: colors.primary[600],
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="count" aria-label="Count view">
                  <BarChartIcon sx={{ mr: 1, fontSize: '1rem' }} />
                  Count
                </ToggleButton>
                <ToggleButton value="nps" aria-label="NPS view">
                  <TrendingUpIcon sx={{ mr: 1, fontSize: '1rem' }} />
                  NPS
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box height="350px">
              <Bar data={barchart} options={chartOptions} />
            </Box>
          </Paper>

          {/* Doughnut Chart */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderRadius: "16px",
              p: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2} color={getTextColor()}>
              Circular Age Distribution
            </Typography>
            <Box height="350px" display="flex" justifyContent="center" alignItems="center">
              <Doughnut data={cercleChart} options={cerclechartOptions} />
            </Box>
          </Paper>
        </Box>

        {/* Simple Clean Table */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: "16px",
            p: 3,
            overflow: 'hidden',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} color={getTextColor()}>
            Detailed Age Group Analysis with NPS Scores
          </Typography>
          
          <TableContainer 
            sx={{ 
              maxHeight: 440,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.mode === "dark" ? colors.grey[800] : colors.grey[200],
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.mode === "dark" ? colors.grey[600] : colors.grey[400],
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === "dark" ? colors.grey[500] : colors.grey[500],
                },
              },
            }}
          >
            <Table stickyHeader aria-label="age group analysis table">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    Age Group
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    Count
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    Percentage
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    NPS Score
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      backgroundColor: colors.primary[500],
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: `2px solid ${colors.primary[600]}`
                    }}
                  >
                    NPS Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {percentKeys.map((key, i) => {
                  const npsScore = data[npsKeys[i]];
                  const npsStatus = getNpsStatus(npsScore);
                  
                  return (
                    <TableRow 
                      key={i}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.mode === "dark" 
                            ? colors.primary[500] 
                            : colors.grey[50],
                        },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          color: getTextColor(),
                          fontWeight: 'medium',
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: getTextColor(),
                          fontWeight: 'medium',
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        {key}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          color: getTextColor(),
                          fontWeight: 'medium',
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        {(data[valueKeys[i]] || 0).toLocaleString()}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          color: getTextColor(),
                          fontWeight: 'medium',
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        {(data[key] || 0).toFixed(1)}%
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          color: getTextColor(),
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        {npsScore !== null && npsScore !== undefined 
                          ? npsScore.toFixed(1) 
                          : "N/A"}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{
                          borderBottom: `1px solid ${theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300]}`,
                          py: 2
                        }}
                      >
                        <Chip
                          label={npsStatus.label}
                          color={npsStatus.color}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 'medium',
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};
