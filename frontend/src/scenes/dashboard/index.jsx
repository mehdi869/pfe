import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  Chip,
  Paper,
  Fade,
  Zoom,
} from "@mui/material"
import { tokens } from "../../styles/theme"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import RefreshIcon from "@mui/icons-material/Refresh"
import FilterListIcon from "@mui/icons-material/FilterList"
import DateRangeIcon from "@mui/icons-material/DateRange"
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt"
import RemoveIcon from "@mui/icons-material/Remove"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import CommentIcon from "@mui/icons-material/Comment"
import PeopleIcon from "@mui/icons-material/People"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import DownloadIcon from "@mui/icons-material/Download"
import ShareIcon from "@mui/icons-material/Share"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
)

const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [animateCharts, setAnimateCharts] = useState(false)

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
    newComments: 87,
    lastUpdated: "Today at 10:45 AM",
  })
  // real data integration


  // Mock data for charts
  const [chartData, setChartData] = useState({
    npsOverTime: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "NPS Score",
          data: [32, 35, 30, 38, 40, 35, 38, 40, 42, 45, 42, 48],
          borderColor: colors.primary[500],
          backgroundColor: `${colors.primary[500]}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.primary[500],
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    responseDistribution: {
      labels: ["Promoters", "Passives", "Detractors"],
      datasets: [
        {
          data: [52, 38, 10],
          backgroundColor: [
            "#4caf50", // Green for promoters
            "#ff9800", // Orange for passives
            colors.primary[500], // Red for detractors
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    },
    segmentComparison: {
      labels: ["Mobile", "Internet", "Business", "Prepaid", "Postpaid"],
      datasets: [
        {
          label: "NPS Score",
          data: [45, 38, 52, 40, 35],
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[600],
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: colors.primary[400],
        },
      ],
    },
    responseOverTime: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Promoters",
          data: [42, 45, 40, 48, 50, 45, 48, 50, 52, 55, 52, 58],
          borderColor: "#4caf50",
          backgroundColor: "#4caf5020",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Passives",
          data: [38, 35, 40, 32, 30, 35, 32, 30, 38, 35, 38, 32],
          borderColor: "#ff9800",
          backgroundColor: "#ff980020",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Detractors",
          data: [20, 20, 20, 20, 20, 20, 20, 20, 10, 10, 10, 10],
          borderColor: colors.primary[500],
          backgroundColor: `${colors.primary[500]}20`,
          tension: 0.4,
          fill: true,
        },
      ],
    },
  })

  // Function to handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setAnimateCharts(false)

    // Simulate loading
    setTimeout(() => {
      // Simulate updated data
      const updatedNpsData = {
        ...npsData,
        currentScore: Math.floor(Math.random() * 20) + 30, // Random score between 30-50
        lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Calculate new trend
      updatedNpsData.trend = (updatedNpsData.currentScore - npsData.previousScore).toString()
      if (updatedNpsData.trend > 0) updatedNpsData.trend = "+" + updatedNpsData.trend

      setNpsData(updatedNpsData)
      setIsLoading(false)

      // Trigger chart animations after data update
      setTimeout(() => {
        setAnimateCharts(true)
      }, 300)
    }, 1500)
  }

  // Handle time range menu
  const handleTimeRangeClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleTimeRangeClose = (range) => {
    if (range) {
      setTimeRange(range)
      // Here you would fetch data for the selected time range
      handleRefresh()
    }
    setAnchorEl(null)
  }

  // Handle more menu
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Trigger initial animation on mount
  useEffect(() => {
    setTimeout(() => {
      setAnimateCharts(true)
    }, 500)
  }, [])

  // NPS Score Card Component
  const NPSScoreCard = () => {
    // Calculate the color based on NPS score
    const getScoreColor = (score) => {
      if (score < 0) return "#d32f2f" // Red for negative
      if (score < 30) return "#ff9800" // Orange for low
      if (score < 50) return "#2196f3" // Blue for medium
      return "#4caf50" // Green for high
    }

    const scoreColor = getScoreColor(npsData.currentScore)

    return (
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: "16px",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            backgroundColor: scoreColor,
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
              Overall NPS Score
            </Typography>
            <Tooltip title="Net Promoter Score measures customer loyalty and satisfaction. It ranges from -100 to 100.">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Zoom in={animateCharts} timeout={500}>
            <Box display="flex" alignItems="center" mt={3}>
              <Typography
                variant="h1"
                fontWeight="bold"
                sx={{
                  color: scoreColor,
                  fontSize: { xs: "48px", sm: "64px" },
                  transition: "color 0.3s ease",
                }}
              >
                {npsData.currentScore}
              </Typography>

              <Box ml={2} display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  {Number.parseFloat(npsData.trend) >= 0 ? (
                    <TrendingUpIcon sx={{ color: "#4caf50", fontSize: "20px", mr: "5px" }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: colors.redAccent[500], fontSize: "20px", mr: "5px" }} />
                  )}
                  <Typography
                    variant="body1"
                    color={Number.parseFloat(npsData.trend) >= 0 ? "#4caf50" : colors.redAccent[500]}
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
          </Zoom>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <ThumbUpAltIcon sx={{ color: "#4caf50", mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Promoters
                  </Typography>
                </Box>
                <Fade in={animateCharts} timeout={800}>
                  <Typography variant="h5" fontWeight="bold" color="#4caf50">
                    {npsData.promoters}%
                  </Typography>
                </Fade>
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
                <Fade in={animateCharts} timeout={800}>
                  <Typography variant="h5" fontWeight="bold" color="#ff9800">
                    {npsData.passives}%
                  </Typography>
                </Fade>
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
                <Fade in={animateCharts} timeout={800}>
                  <Typography variant="h5" fontWeight="bold" color={colors.primary[500]}>
                    {npsData.detractors}%
                  </Typography>
                </Fade>
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="caption" color={colors.grey[500]}>
              Last updated: {npsData.lastUpdated}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Stat Card Component
  const StatCard = ({ title, value, icon, subtitle, color }) => {
    return (
      <Card
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: "16px",
          height: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                {title}
              </Typography>
              <Fade in={animateCharts} timeout={800}>
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  mt="10px"
                  sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                >
                  {value}
                </Typography>
              </Fade>
              <Typography variant="body2" color={colors.grey[100]} mt="5px">
                {subtitle}
              </Typography>
            </Box>
            <Zoom in={true} timeout={500}>
              <Box
                sx={{
                  backgroundColor: color,
                  borderRadius: "50%",
                  p: 1.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0 4px 10px ${color}80`,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {icon}
              </Box>
            </Zoom>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "rgba(255, 255, 255, 0.9)",
        titleColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        bodyColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        borderColor: theme.palette.mode === "dark" ? colors.primary[300] : "#e0e0e0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "rgba(255, 255, 255, 0.9)",
        titleColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        bodyColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        borderColor: theme.palette.mode === "dark" ? colors.primary[300] : "#e0e0e0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    cutout: "65%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: "easeOutQuart",
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "rgba(255, 255, 255, 0.9)",
        titleColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        bodyColor: theme.palette.mode === "dark" ? "#fff" : "#000",
        borderColor: theme.palette.mode === "dark" ? colors.primary[300] : "#e0e0e0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
    barPercentage: 0.7,
    categoryPercentage: 0.7,
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "16px",
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box display="flex" alignItems="center">
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
              NPS DASHBOARD
            </Typography>
            {/* <Chip
              label={`${timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : timeRange === "quarter" ? "Quarterly" : "Yearly"}`}
              size="small"
              color="primary"
              sx={{ ml: 2, fontWeight: "bold" }}
            /> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: { xs: 2, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
            }}
          >
            {/* <Button
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#f5f5f5",
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: { xs: "8px 15px", md: "10px 20px" },
                borderRadius: "10px",
                ml: { sm: 2 },
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[300] : "#e0e0e0",
                },
              }}
              onClick={handleTimeRangeClick}
              startIcon={<DateRangeIcon />}
            >
              {timeRange === "week"
                ? "This Week"
                : timeRange === "month"
                  ? "This Month"
                  : timeRange === "quarter"
                    ? "This Quarter"
                    : "This Year"}
            </Button> */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleTimeRangeClose(null)}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: "10px",
                  minWidth: "150px",
                  mt: 1,
                },
              }}
            >
              <MenuItem onClick={() => handleTimeRangeClose("week")}>This Week</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose("month")}>This Month</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose("quarter")}>This Quarter</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose("year")}>This Year</MenuItem>
            </Menu>

            <Button
              sx={{
                backgroundColor: colors.primary[500],
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                padding: { xs: "8px 15px", md: "10px 20px" },
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: colors.primary[600],
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                },
              }}
              startIcon={<DownloadOutlinedIcon />}
            >
              Export Data
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, width: "100%", overflowX: "auto" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: { xs: "12px", sm: "14px" },
                textTransform: "none",
                minWidth: { xs: 80, sm: 120 },
                borderRadius: "8px 8px 0 0",
                transition: "all 0.3s ease",
              },
              "& .Mui-selected": {
                color: colors.primary[500],
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: colors.primary[500],
                height: "3px",
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Overview" icon={<TrendingUpIcon fontSize="small" />} iconPosition="start" />
            </Tabs>
        </Box>
      </Paper>

      {/* OVERVIEW TAB */}
      {tabValue === 0 && (
        <>
          {/* TOP STATS */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              mb: 3,
              background: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold">
                Performance Summary
              </Typography>
              {/* <Tooltip title="Filter data">
                <IconButton size="small">
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip> */}
            </Box>
            <Grid container spacing={3} mb="10px">
              <Grid item xs={12} md={6} lg={4}>
                <NPSScoreCard />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="RESPONSE RATE"
                  value={`${npsData.responseRate}%`}
                  subtitle={`${npsData.totalResponses.toLocaleString()} total responses`}
                  icon={<PeopleIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color="#2196f3" // Blue
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="PROMOTERS"
                  value={`${npsData.promoters}%`}
                  subtitle="9-10 ratings"
                  icon={<ThumbUpAltIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color="#4caf50" // Green
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="DETRACTORS"
                  value={`${npsData.detractors}%`}
                  subtitle="0-6 ratings"
                  icon={<ThumbDownAltIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color={colors.primary[500]} // Red
                />
              </Grid>
            </Grid>
          </Paper>

          {/* CHARTS */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  borderRadius: "16px",
                  p: 3,
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} minWidth={"500px"}>
                  <Typography variant="h5" fontWeight="bold">
                    NPS Score Trend
                  </Typography>
                </Box>
                <Box height={300}>
                  <Line
                    data={chartData.npsOverTime}
                    options={lineOptions}
                    key={animateCharts ? "animated" : "static"}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  borderRadius: "16px",
                  p: 3,
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} minWidth={"270px"}>
                  <Typography variant="h5" fontWeight="bold">
                    Response Distribution
                  </Typography>
                </Box>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Doughnut
                    data={chartData.responseDistribution}
                    options={pieOptions}
                    key={animateCharts ? "animated" : "static"}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} minWidth={"500px"}>
                  <Typography variant="h5" fontWeight="bold">
                    NPS by Segment
                  </Typography>
                </Box>
                <Box height={300}>
                  <Bar
                    data={chartData.segmentComparison}
                    options={barOptions}
                    key={animateCharts ? "animated" : "static"}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} minWidth={"500px"}>
                  <Typography variant="h5" fontWeight="bold">
                    Response Breakdown Over Time
                  </Typography>
                </Box>
                <Box height={300}>
                  <Line
                    data={chartData.responseOverTime}
                    options={lineOptions}
                    key={animateCharts ? "animated-responses" : "static-responses"}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* RESPONSES TAB */}
      {tabValue === 1 && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: "16px",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Response Analysis
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="300px">
            <Typography variant="body1" color={colors.grey[500]}>
              Response data and analysis will be displayed here.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* SEGMENTS TAB */}
      {tabValue === 2 && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: "16px",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Segment Analysis
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="300px">
            <Typography variant="body1" color={colors.grey[500]}>
              Segment comparison data will be displayed here.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* COMMENTS TAB */}
      {tabValue === 3 && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderRadius: "16px",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Comment Analysis
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="300px">
            <Typography variant="body1" color={colors.grey[500]}>
              Customer comments and sentiment analysis will be displayed here.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default Dashboard
