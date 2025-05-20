import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Card, CardContent, Typography, useTheme, CircularProgress, Alert, Button, IconButton, Snackbar, Grid, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { tokens } from "../../styles/theme";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fetchQuestionTypeStats } from '../../API/api';
import { AuthContext } from "../../context/AuthContext";
import { exportToExcel } from "../../utils/utility";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const chartRef = useRef(null);
  const authContext = useContext(AuthContext);
  
  // State for data and UI
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState('vertical');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchQuestionTypeStats(authContext);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    // If no data or refreshing, load data
    if (!stats || refreshing) {
      loadData();
    }
  }, [stats, refreshing]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setSnackbar({
      open: true,
      message: "Refreshing chart data...",
      severity: "info"
    });
  };

  // Handle Export
  const handleExport = () => {
    const chart =
      stats?.question_types?.labels && stats?.question_types?.counts
        ? {
            labels: stats.question_types.labels,
            counts: stats.question_types.counts,
          }
        : {
            labels: mockData.labels,
            counts: mockData.datasets[0].data,
          };

    const rows = chart.labels.map((label, i) => ({
      "Question Type": label,
      "Number of Responses": chart.counts[i],
    }));

    exportToExcel({
      rows,
      sheetName: "BarChart",
      fileName: "bar_chart_data.xlsx",
    });

    setSnackbar({
      open: true,
      message: "Chart data exported successfully!",
      severity: "success",
    });
 };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle chart type change
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartType === 'horizontal' ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Question Type Distribution',
        font: {
          size: 16,
          weight: 'bold',
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed[chartType === 'horizontal' ? 'x' : 'y'];
            const total = stats?.total_responses || 0;
            const percentage = total > 0 ? Math.round(value / total * 100) : 0;
            return `${value} responses (${percentage}%)`;
          }
        },
        backgroundColor: colors.primary[500],
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        cornerRadius: 8,
        boxPadding: 4,
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          }
        },
        title: {
          display: chartType === 'vertical',
          text: 'Question Types',
          font: {
            size: 14,
            weight: 'bold',
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          }
        },
        title: {
          display: chartType === 'vertical',
          text: 'Number of Responses',
          font: {
            size: 14,
            weight: 'bold',
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  };

  // Chart data
  const data = {
    labels: stats?.question_types?.labels || [],
    datasets: [
      {
        label: 'Number of Responses',
        data: stats?.question_types?.counts || [],
        backgroundColor: colors.primary[500] + 'CC', // Add transparency
        borderColor: colors.primary[500],
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: colors.primary[400],
        hoverBorderColor: colors.primary[600],
        hoverBorderWidth: 2,
      },
    ],
  };

  // Mock data for when API fails
  const mockData = {
    labels: ['Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching', 'Fill in the Blank'],
    datasets: [
      {
        label: 'Number of Responses',
        data: [120, 85, 60, 45, 30, 25],
        backgroundColor: colors.primary[500] + 'CC',
        borderColor: colors.primary[500],
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: colors.primary[400],
        hoverBorderColor: colors.primary[600],
        hoverBorderWidth: 2,
      },
    ],
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header 
          title="BAR CHART" 
          subtitle="Question Type Distribution Analysis" 
          action={true}
          actionText="Download Chart"
          actionIcon={<DownloadOutlinedIcon />}
          onAction={handleExport}
        />
      </Box>

      {/* LOADING STATE */}
      {loading && !refreshing && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="70vh"
          flexDirection="column"
        >
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ color: colors.primary[500] }} 
          />
          <Typography variant="h5" mt={2} color={colors.grey[100]}>
            Loading chart data...
          </Typography>
        </Box>
      )}

      {/* ERROR STATE */}
      {error && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="70vh"
          flexDirection="column"
        >
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              width: '100%', 
              maxWidth: 500,
              borderRadius: '10px',
            }}
          >
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: colors.primary[500],
              '&:hover': {
                backgroundColor: colors.primary[600],
              }
            }}
          >
            Try Again
          </Button>
        </Box>
      )}

      {/* CHART CONTENT */}
      {(!loading || refreshing) && !error && (
        <Grid container spacing={3}>
          {/* CHART CONTROLS */}
          <Grid item xs={12}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              mb={2}
            >
              <Box display="flex" alignItems="center">
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="chart-type-label">Chart Type</InputLabel>
                  <Select
                    labelId="chart-type-label"
                    id="chart-type-select"
                    value={chartType}
                    label="Chart Type"
                    onChange={handleChartTypeChange}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'rgba(0, 0, 0, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[500],
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[500],
                      }
                    }}
                  >
                    <MenuItem value="vertical">Vertical Bar</MenuItem>
                    <MenuItem value="horizontal">Horizontal Bar</MenuItem>
                  </Select>
                </FormControl>
                <IconButton 
                  onClick={handleRefresh} 
                  sx={{ 
                    ml: 2,
                    color: colors.primary[500],
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(237, 28, 36, 0.1)',
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Total Responses: <strong style={{ marginLeft: '4px' }}>{stats?.total_responses || 365}</strong>
              </Typography>
            </Box>
          </Grid>

          {/* MAIN CHART */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card 
                sx={{ 
                  borderRadius: '15px',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                      : '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent>
                  <Box height={500}>
                    <Bar 
                      ref={chartRef} 
                      options={options} 
                      data={stats?.question_types?.labels ? data : mockData} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* CHART INSIGHTS */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card 
                sx={{ 
                  borderRadius: '15px',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" mb={2} color={colors.grey[100]}>
                    Chart Insights
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]}>
                    This chart displays the distribution of different question types in our system. 
                    {stats?.question_types?.labels && stats.question_types.labels.length > 0 ? (
                      <>
                        {' '}The most common question type is <strong>{stats.question_types.labels[0]}</strong> with {stats.question_types.counts[0]} responses, 
                        representing {Math.round(stats.question_types.counts[0] / stats.total_responses * 100)}% of all questions.
                      </>
                    ) : (
                      ' The data shows a clear preference for Multiple Choice questions, which make up approximately 33% of all questions in the system.'
                    )}
                  </Typography>
                  <Typography variant="body1" color={colors.grey[100]} mt={2}>
                    Use this information to understand user preferences and optimize your question creation strategy.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: theme.palette.mode === "dark" 
              ? "0 8px 32px rgba(0, 0, 0, 0.3)" 
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BarChart;