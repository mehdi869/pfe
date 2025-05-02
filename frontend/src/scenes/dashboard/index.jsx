import { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme, Grid, Card, CardContent, IconButton, Divider, Tab, Tabs, Menu, MenuItem, CircularProgress } from "@mui/material";
import { tokens } from "../../styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import RemoveIcon from "@mui/icons-material/Remove";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CommentIcon from "@mui/icons-material/Comment";
import PeopleIcon from "@mui/icons-material/People";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Mock data for NPS scores
  const [npsData, setNpsData] = useState({
    currentScore: 42,
    previousScore: 38,
    trend: "+4",
    promoters: 52,
    passives: 38,
    detractors: 10,
    responseRate: 28,
    totalResponses: 1243,
    newComments: 87
  });

  // Mock data for charts
  const [chartData, setChartData] = useState({
    npsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'NPS Score',
          data: [32, 35, 30, 38, 40, 35, 38, 40, 42, 45, 42, 48],
          borderColor: colors.primary[500],
          backgroundColor: 'rgba(237, 28, 36, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    },
    responseDistribution: {
      labels: ['Promoters', 'Passives', 'Detractors'],
      datasets: [
        {
          data: [52, 38, 10],
          backgroundColor: [
            '#4caf50', // Green for promoters
            '#ff9800', // Orange for passives
            colors.primary[500], // Red for detractors
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        }
      ]
    },
    segmentComparison: {
      labels: ['Mobile', 'Internet', 'Business', 'Prepaid', 'Postpaid'],
      datasets: [
        {
          label: 'NPS Score',
          data: [45, 38, 52, 40, 35],
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[600],
          borderWidth: 1,
          borderRadius: 5,
        }
      ]
    }
  });

  // Function to handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Handle time range menu
  const handleTimeRangeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTimeRangeClose = (range) => {
    if (range) {
      setTimeRange(range);
      // Here you would fetch data for the selected time range
    }
    setAnchorEl(null);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // NPS Score Card Component
  const NPSScoreCard = () => {
    // Calculate the color based on NPS score
    const getScoreColor = (score) => {
      if (score < 0) return "#d32f2f"; // Red for negative
      if (score < 30) return "#ff9800"; // Orange for low
      if (score < 50) return "#2196f3"; // Blue for medium
      return "#4caf50"; // Green for high
    };

    const scoreColor = getScoreColor(npsData.currentScore);

    return (
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            backgroundColor: scoreColor,
          }}
        />
        <CardContent>
          <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
            Overall NPS Score
          </Typography>
          
          <Box display="flex" alignItems="center" mt={2}>
            <Typography 
              variant="h1" 
              fontWeight="bold" 
              sx={{ 
                color: scoreColor,
                fontSize: "64px"
              }}
            >
              {npsData.currentScore}
            </Typography>
            
            <Box ml={2} display="flex" flexDirection="column">
              <Box display="flex" alignItems="center">
                {parseFloat(npsData.trend) >= 0 ? (
                  <TrendingUpIcon sx={{ color: "#4caf50", fontSize: "20px", mr: "5px" }} />
                ) : (
                  <TrendingDownIcon sx={{ color: colors.redAccent[500], fontSize: "20px", mr: "5px" }} />
                )}
                <Typography
                  variant="body1"
                  color={parseFloat(npsData.trend) >= 0 ? "#4caf50" : colors.redAccent[500]}
                  fontWeight="bold"
                >
                  {npsData.trend} pts
                </Typography>
              </Box>
              <Typography variant="body2" color={colors.grey[100]}>
                vs previous {timeRange}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <ThumbUpAltIcon sx={{ color: "#4caf50", mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Promoters
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="#4caf50">
                  {npsData.promoters}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <RemoveIcon sx={{ color: "#ff9800", mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Passives
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="#ff9800">
                  {npsData.passives}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <ThumbDownAltIcon sx={{ color: colors.primary[500], mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Detractors
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color={colors.primary[500]}>
                  {npsData.detractors}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, subtitle, color }) => {
    return (
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          height: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" mt="10px">
                {value}
              </Typography>
              <Typography variant="body2" color={colors.grey[100]} mt="5px">
                {subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: color,
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 4px 10px ${color}80`,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'NPS Score Trend',
      },
    },
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Response Distribution',
      },
    },
    cutout: '50%',
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'NPS by Segment',
      },
    },
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        {/* <Header title="NPS DASHBOARD" subtitle="Monitor and analyze your Net Promoter Score" /> */} {/* Removed Header component */}
        {/* Add a simple title if needed */}
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          NPS DASHBOARD
        </Typography>

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#f5f5f5",
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "5px",
              mr: 2,
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[300] : "#e0e0e0",
              },
            }}
            onClick={handleTimeRangeClick}
            startIcon={<DateRangeIcon />}
          >
            {timeRange === "week" ? "This Week" : 
             timeRange === "month" ? "This Month" : 
             timeRange === "quarter" ? "This Quarter" : "This Year"}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleTimeRangeClose(null)}
          >
            <MenuItem onClick={() => handleTimeRangeClose("week")}>This Week</MenuItem>
            <MenuItem onClick={() => handleTimeRangeClose("month")}>This Month</MenuItem>
            <MenuItem onClick={() => handleTimeRangeClose("quarter")}>This Quarter</MenuItem>
            <MenuItem onClick={() => handleTimeRangeClose("year")}>This Year</MenuItem>
          </Menu>
          
          <Button
            sx={{
              backgroundColor: colors.primary[500],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: colors.primary[600],
              },
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
            onClick={handleRefresh}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </Box>
      </Box>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: colors.primary[500],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary[500],
              height: '3px',
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Responses" />
          <Tab label="Segments" />
          <Tab label="Comments" />
        </Tabs>
      </Box>

      {/* OVERVIEW TAB */}
      {tabValue === 0 && (
        <>
          {/* TOP STATS */}
          <Grid container spacing={3} mb="20px">
            <Grid item xs={12} md={6} lg={4}>
              <NPSScoreCard />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <StatCard 
                title="RESPONSE RATE" 
                value={`${npsData.responseRate}%`} 
                subtitle={`${npsData.totalResponses} total responses`}
                icon={<PeopleIcon sx={{ color: "#fff", fontSize: 24 }} />} 
                color="#2196f3" // Blue
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <StatCard 
                title="NEW COMMENTS" 
                value={npsData.newComments} 
                subtitle="Unreviewed feedback"
                icon={<CommentIcon sx={{ color: "#fff", fontSize: 24 }} />} 
                color="#9c27b0" // Purple
              />
            </Grid>
          </Grid>

          {/* CHARTS */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  p: 2,
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  NPS Score Trend
                </Typography>
                <Box height={300}>
                  <Line data={chartData.npsOverTime} options={lineOptions} />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  p: 2,
                  height: "100%",
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Response Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Pie data={chartData.responseDistribution} options={pieOptions} />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  p: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  NPS by Segment
                </Typography>
                <Box height={300}>
                  <Bar data={chartData.segmentComparison} options={barOptions} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* RESPONSES TAB */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" mb={3}>Response Analysis</Typography>
          <Typography>Response data and analysis will be displayed here.</Typography>
        </Box>
      )}

      {/* SEGMENTS TAB */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" mb={3}>Segment Analysis</Typography>
          <Typography>Segment comparison data will be displayed here.</Typography>
        </Box>
      )}

      {/* COMMENTS TAB */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" mb={3}>Comment Analysis</Typography>
          <Typography>Customer comments and sentiment analysis will be displayed here.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;