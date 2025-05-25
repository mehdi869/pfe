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
  Paper,
  Fade,
  Zoom,
  ClickAwayListener,
} from "@mui/material"
import { tokens } from "../../styles/theme"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt"
import RemoveIcon from "@mui/icons-material/Remove"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Bar, Doughnut } from "react-chartjs-2"
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
import { fetchQuickStats } from "../../API/api" // Add this import
import { exportToExcel } from "../../utils/utils"          // ← your Excel helper

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
  const [tabValue, setTabValue]             = useState(0)
  const [animateCharts, setAnimateCharts]   = useState(false)

  // ← add export UI state
  const [showExportOptions, setShowExportOptions] = useState(false)

  const [npsData, setNpsData] = useState({
    nps_score: null,
    promoters: null,
    passives: null,
    detractors: null,
    total_responses: null,
    null_responses: null,
    response_rate: null,
    last_refresh_date: null,
    nps_score_trend: null,
  })
  // real data integration
  // Utility to validate quick stats data
  const isValidQuickStats = (data) => {
    return (
      data &&
      typeof data === "object" &&
      typeof data.nps_score === "number" &&
      typeof data.promoters === "number" &&
      typeof data.passives === "number" &&
      typeof data.detractors === "number" &&
      typeof data.total_responses === "number"
    )
  }
  // create some variables to hold the percentage of promoters, passives, and detractors\
  const promotersPercentage = ((npsData.promoters / npsData.total_responses) * 100).toFixed(2)
  const passivesPercentage = ((npsData.passives / npsData.total_responses) * 100).toFixed(2)
  const detractorsPercentage = ((npsData.detractors / npsData.total_responses) * 100).toFixed(2)

  // Fetch and cache quick stats
  useEffect(() => {
    const loadQuickStats = async () => {
      // Try to get from localStorage
      const cached = localStorage.getItem("quickStats")
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (isValidQuickStats(parsed)) {
            setNpsData(parsed)
            return
          }
        } catch (e) {
          // Ignore and fetch from server
        }
      }
      // Fetch from server if missing or invalid
      try {
        const stats = await fetchQuickStats()
        setNpsData(stats)
        localStorage.setItem("quickStats", JSON.stringify(stats))
      } catch (e) {
        // handle error (show message or fallback)
      }
    }
    loadQuickStats()
  }, [])

  // Optionally, add a refresh button to clear cache and refetch
  const handleRefreshStats = async () => {
    try {
      const stats = await fetchQuickStats()
      setNpsData(stats)
      localStorage.setItem("quickStats", JSON.stringify(stats))
    } catch (e) {
      // handle error
    }
  }
  // Nps per chart
  const [chartData, setChartData] = useState({
    responseDistribution: {
      labels: ["Promoters", "Passives", "Detractors"],
      datasets: [
        {
          data: [
            Math.round(Number(promotersPercentage) || 0),
            Math.round(Number(passivesPercentage) || 0),
            Math.round(Number(detractorsPercentage) || 0),
          ],
          backgroundColor: [
            colors.greenAccent[500], // Green for promoters
            colors.purpleAccent[500], // Orange for passives
            colors.primary[500], // Red for detractors
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    },
    segmentComparison: {
      labels: [],
      datasets: [
        {
          label: "NPS Score",
          data: [],
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[600],
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: colors.primary[400],
        },
      ],
    },
  })

  useEffect(() => {
    if (npsData.total_responses > 0) {
      setChartData((prev) => ({
        ...prev,
        responseDistribution: {
          ...prev.responseDistribution,
          datasets: [
            {
              ...prev.responseDistribution.datasets[0],
              data: [
                Math.round(Number(promotersPercentage)),
                Math.round(Number(passivesPercentage)),
                Math.round(Number(detractorsPercentage)),
              ],
            },
          ],
        },
      }))
    }
  }, [promotersPercentage, passivesPercentage, detractorsPercentage])

  // Add this useEffect after your other useEffects
  useEffect(() => {
    if (Array.isArray(npsData.nps_by_segment) && npsData.nps_by_segment.length > 0) {
      const labels = npsData.nps_by_segment.map((seg) => seg.segment_type)
      const data = npsData.nps_by_segment.map((seg) => {
        const total = (seg.promotors || 0) + (seg.detractors || 0) + (seg.passives || 0)
        if (total === 0) return 0
        const percentPromoters = (seg.promotors / total) * 100
        const percentDetractors = (seg.detractors / total) * 100
        return Math.round(percentPromoters - percentDetractors)
      })

      setChartData((prev) => ({
        ...prev,
        segmentComparison: {
          ...prev.segmentComparison,
          labels,
          datasets: [
            {
              ...prev.segmentComparison.datasets[0],
              data,
            },
          ],
        },
      }))
    }
  }, [npsData.nps_by_segment])

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

      setNpsData(updatedNpsData)
      setIsLoading(false)

      // Trigger chart animations after data update
      setTimeout(() => {
        setAnimateCharts(true)
      }, 300)
    }, 1500)
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
    if (!npsData) return <CircularProgress />
    // Calculate the color based on NPS score
    const getScoreColor = (score) => {
      if (score < 0) return "#d32f2f" // Red for negative
      if (score < 30) return "#ff9800" // Orange for low
      if (score < 50) return "#2196f3" // Blue for medium
      return colors.greenAccent[500] // Green for high
    }

    const scoreColor = getScoreColor(npsData.nps_score)

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
                  fontSize: { xs: "36px", sm: "48px", md: "64px" },
                  transition: "color 0.3s ease",
                }}
              >
                {npsData.nps_score}%
              </Typography>
            </Box>
          </Zoom>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <ThumbUpAltIcon sx={{ color: colors.greenAccent[500], mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Promoters
                  </Typography>
                </Box>
                <Fade in={animateCharts} timeout={800}>
                  <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[500]}>
                    {npsData.promoters}
                  </Typography>
                </Fade>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <RemoveIcon sx={{ color: colors.purpleAccent[500], mr: 0.5 }} />
                  <Typography variant="body2" color={colors.grey[100]}>
                    Passives
                  </Typography>
                </Box>
                <Fade in={animateCharts} timeout={800}>
                  <Typography variant="h5" fontWeight="bold" color={colors.purpleAccent[500]}>
                    {npsData.passives}
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
                    {npsData.detractors}
                  </Typography>
                </Fade>
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="caption" color={colors.grey[500]}>
              Last updated: {npsData.last_refresh_date || "N/A"}
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
            height: "4px",
            backgroundColor: color,
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="h6"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {title}
              </Typography>
              <Fade in={true} timeout={800}>
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  mt="10px"
                  sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
                >
                  {value}
                </Typography>
              </Fade>
              <Typography
                variant="body2"
                color={theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}
                mt="5px"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.2",
                  minHeight: "2.4em",
                }}
              >
                {subtitle}
              </Typography>
            </Box>
            <Zoom in={true} timeout={500}>
              <Box
                sx={{
                  backgroundColor: color,
                  borderRadius: "50%",
                  p: { xs: 1, sm: 1.5 },
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

  // Add this component after the StatCard component
  const ResponseRateCard = () => {
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
            height: "4px",
            backgroundColor: "#2196f3",
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              RESPONSE RATE
            </Typography>
            <Tooltip title="Percentage of surveys that received a response">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Fade in={true} timeout={800}>
            <Typography
              variant="h3"
              color="#2196f3"
              fontWeight="bold"
              mt="10px"
              sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
            >
              {`${npsData.response_rate}%`}
            </Typography>
          </Fade>

          <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
            <PeopleIcon sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body1" fontWeight="medium" color={colors.grey[100]}>
              {npsData.total_responses} valid responses
            </Typography>
          </Box>

          <Box mt={1} sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              color={theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}
              sx={{ ml: "1.7rem" }}
            >
              out of {npsData.total_responses + npsData.null_responses} total
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Chart options

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
          color: colors.grey[100],
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
          label: (context) => {
            const label = context.label || ""
            const value = context.parsed
            return `${label}: ${value}%`
          },
        },
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

  // ← add handlers
  const handleExportClose = () => setShowExportOptions(false)

  const handleExcelExport = () => {
    exportToExcel({
      rows: [
        {
          "NPS Score":       npsData.nps_score,
          Promoters:         npsData.promoters,
          Passives:          npsData.passives,
          Detractors:        npsData.detractors,
          "Total Responses": npsData.total_responses,
        },
      ],
      sheetName: "Dashboard",
      fileName:  "dashboard_data.xlsx",
    })
    handleExportClose()
  }

  const handlePdfExport = () => {
    alert("PDF export not implemented yet.")
    handleExportClose()
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
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h2">NPS DASHBOARD</Typography>
          {/* EXPORT BUTTON WRAPPER */}
          <Box
            sx={{
              position: "relative",
              display:  "inline-block",
              mt:        { xs: 2, sm: 0 },
            }}
          >
            <Button
              onClick={() => setShowExportOptions(open => !open)}
              startIcon={<DownloadOutlinedIcon />}
              sx={{ backgroundColor: colors.primary[500], color: "#fff" }}
            >
              Export Data
            </Button>

            {showExportOptions && (
              <ClickAwayListener onClickAway={handleExportClose}>
                <Box
                  sx={{
                    position:        "absolute",
                    top:             "100%",
                    right:           0,
                    mt:              1,
                    bgcolor:         theme.palette.background.paper,
                    boxShadow:       "0 2px 8px rgba(0,0,0,0.15)",
                    borderRadius:    1,
                    display:         "flex",
                    flexDirection:   "column",
                    zIndex:          10,
                  }}
                >
                  <Button onClick={handleExcelExport} sx={{ textTransform: "none" }}>
                    Excel
                  </Button>
                  <Button onClick={handlePdfExport} sx={{ textTransform: "none" }}>
                    PDF
                  </Button>
                </Box>
              </ClickAwayListener>
            )}
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
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3 }} mb="10px">
              <Grid item xs={12} md={6} lg={4}>
                <NPSScoreCard />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <ResponseRateCard />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="PROMOTERS"
                  value={`${promotersPercentage}%`}
                  subtitle="9-10 ratings"
                  icon={<ThumbUpAltIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color={colors.greenAccent[500]} // Green
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="PASSIVES"
                  value={`${passivesPercentage}%`}
                  subtitle="7-8 ratings"
                  icon={<RemoveIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color={colors.grey[400]} // Orange
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <StatCard
                  title="DETRACTORS"
                  value={`${detractorsPercentage}%`}
                  subtitle="0-6 ratings"
                  icon={<ThumbDownAltIcon sx={{ color: "#fff", fontSize: 24 }} />}
                  color={colors.primary[500]} // Red
                />
              </Grid>
            </Grid>
          </Paper>

          {/* CHARTS */}
          <Grid container spacing={3}>
            
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                  minWidth={{ xs: "100%", sm: "270px" }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Response Distribution
                  </Typography>
                </Box>
                <Box height={{ xs: 250, sm: 300 }} display="flex" alignItems="center" justifyContent="center">
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                  minWidth={{ xs: "100%", sm: "500px" }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    NPS by Segment
                  </Typography>
                </Box>
                <Box height={300}>
                  <Bar
                    data={chartData.segmentComparison}
                    options={{
                      ...barOptions,
                      scales: {
                        y: {
                          min: -10,
                          max: 10,
                          ticks: {
                            stepSize: 10,
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
                      plugins: {
                        ...barOptions.plugins,
                        tooltip: {
                          ...barOptions.plugins.tooltip,
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}%`,
                          },
                        },
                      },
                    }}
                    key={animateCharts ? "animated" : "static"}
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