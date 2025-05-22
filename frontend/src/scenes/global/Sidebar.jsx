import { useState, useEffect, useContext } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useTheme, Avatar, Badge, useMediaQuery } from "@mui/material"
import { Link, useLocation } from "react-router-dom"
import "react-pro-sidebar/dist/css/styles.css"
import { tokens } from "../../styles/theme"
import { AuthContext } from "../../context/AuthContext"

// Icons
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined"
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined"
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import MapOutlinedIcon from "@mui/icons-material/MapOutlined"
import InsightsIcon from "@mui/icons-material/Insights"
import FeedbackIcon from "@mui/icons-material/Feedback"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from "@mui/icons-material/Logout"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

const Item = ({ title, to, icon, selected, setSelected, badge }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const location = useLocation()
  const isActive = location.pathname === to

  useEffect(() => {
    if (isActive) {
      setSelected(title)
    }
  }, [isActive, setSelected, title])

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? colors.primary[500] : colors.grey[100],
        margin: "5px 0",
      }}
      onClick={() => setSelected(title)}
      icon={
        badge ? (
          <Badge
            badgeContent={badge}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.primary[500],
                fontSize: "10px",
                height: "16px",
                minWidth: "16px",
              },
            }}
          >
            {icon}
          </Badge>
        ) : (
          icon
        )
      }
    >
      <Box display="flex" alignItems="center">
        <Typography>{title}</Typography>
        {isActive && (
          <Box
            sx={{
              width: "4px",
              height: "100%",
              backgroundColor: colors.primary[500],
              position: "absolute",
              right: 0,
              borderRadius: "4px 0 0 4px",
            }}
          />
        )}
      </Box>
      <Link to={to} />
    </MenuItem>
  )
}

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [selected, setSelected] = useState("NPS Overview")
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:768px)')
  const isVerySmall = useMediaQuery('(max-width:480px)')

  // Get the user info and logout function from AuthContext
  const { user, logout } = useContext(AuthContext)

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [isMobile, setIsCollapsed])

  // Set selected based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === "/Dashboard") setSelected("NPS Overview")
    else if (path === "/segmentation") setSelected("Segmentation")
    else if (path === "/trends") setSelected("Trends & Forecasting")
    else if (path === "/comments") setSelected("Comment Analysis")
    else if (path === "/benchmarks") setSelected("Benchmarks")
    else if (path === "/admin-panel") setSelected("Admin Panel")
    else if (path === "/profile") setSelected("Profile")
    else if (path === "/barChart") setSelected("Status Chart")
    else if (path === "/nps") setSelected("NPS Chart")
    else if (path === "/age") setSelected("Age Chart")
    else if (path === "/pie") setSelected("Pie Chart")
    else if (path === "/status") setSelected("Line Chart") // Changed name to avoid duplication
    else if (path === "/Map") setSelected("Geography Chart")
  }, [location])

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${theme.palette.mode === "dark" ? colors.primary[400] : "#fff"} !important`,
            boxShadow: theme.palette.mode === "dark" ? "none" : "0 0 10px rgba(0, 0, 0, 0.1)",
            borderRight: theme.palette.mode === "dark" ? "none" : `1px solid ${colors.grey[300]}`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 20px 5px 20px !important",
            margin: "5px 0 !important",
            borderRadius: "8px !important",
            transition: "all 0.3s ease !important",
          },
          "& .pro-inner-item:hover": {
            color: `${colors.primary[500]} !important`,
            backgroundColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(237, 28, 36, 0.05)"} !important`,
          },
          "& .pro-menu-item.active": {
            color: `${colors.primary[500]} !important`,
            fontWeight: "bold !important",
          },
          "& .pro-menu-item.active .pro-inner-item": {
            backgroundColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(237, 28, 36, 0.05)"} !important`,
          },
          position: 'relative',
          transition: 'all 0.3s ease',
          // Hide sidebar completely on very small screens when collapsed
          ...(isVerySmall && isCollapsed && {
            '& .pro-sidebar': {
              width: '0px !important',
              minWidth: '0px !important',
            },
            '& .pro-sidebar-inner': {
              width: '0px',
            },
            '& .pro-sidebar-content': {
              display: 'none',
            },
          }),
        }}
      >
        <ProSidebar
          collapsed={isCollapsed}
          width="250px"
          collapsedWidth={isVerySmall ? "0px" : "80px"}
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            transition: 'all 0.3s ease',
          }}
        >
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            {!isVerySmall && (
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                    <Box display="flex" alignItems="center" sx={{ maxWidth: "100%", overflow: "hidden" }}>
                      <img
                        src="/Djezzy_Logo_2015.svg.png"
                        alt="Djezzy Logo"
                        style={{
                          height: "30px",
                          marginRight: "8px",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="h4"
                        color={colors.primary[500]}
                        fontWeight="bold"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "1.2rem",
                          flexShrink: 1,
                          minWidth: 0,
                        }}
                      >
                        DJEZZY NPS
                      </Typography>
                    </Box>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <ChevronLeftIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
            )}

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Avatar sx={{ width: 56, height: 56, bgcolor: colors.primary[500] }}>
                    <AccountCircleIcon sx={{ fontSize: 56, color: "#fff" }} />
                  </Avatar>
                </Box>
                <Box textAlign="center" mt="10px">
                  <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                    {user?.username || "Guest"}
                  </Typography>
                  <Typography variant="body2" color={colors.primary[500]} fontWeight="500">
                    {user?.user_type || ""}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box 
              paddingLeft={isCollapsed ? undefined : "10%"}
              display="flex" 
              flexDirection="column" 
              justifyContent="space-between"
              height={!isCollapsed && "calc(100% - 180px)"}
            >
              <Box>
                {/* NPS Overview */}
                <Item
                  title="NPS Overview"
                  to="/Dashboard"
                  icon={<InsightsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/* CHARTS */}
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  sx={{
                    m: "15px 0 5px 20px",
                    display: isCollapsed ? "none" : "block",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  Charts
                </Typography>
                <Item
                  title="Status Chart"
                  to="/barChart"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="NPS Chart"
                  to="/nps"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Age Chart"
                  to="/age"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Pie Chart"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Line Chart"
                  to="/status"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Geography Chart"
                  to="/Map"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/* MANAGEMENT */}
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  sx={{
                    m: "15px 0 5px 20px",
                    display: isCollapsed ? "none" : "block",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  Management
                </Typography>

                {(user?.user_type === "admin" || user?.user_type === "Admin") && (
                  <Item
                    title="Admin Panel"
                    to="/admin-panel"
                    icon={<AdminPanelSettingsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                )}
                <Item
                  title="Feedback Collection"
                  to="/feedback"
                  icon={<FeedbackIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/* USER */}
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  sx={{
                    m: "15px 0 5px 20px",
                    display: isCollapsed ? "none" : "block",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  User
                </Typography>
                <Item
                  title="Profile"
                  to="/profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>

              {/* LOGOUT BUTTON AT BOTTOM */}
              <Box mt="auto" mb={2}>
                <MenuItem
                  onClick={handleLogout}
                  icon={<LogoutIcon />}
                  style={{
                    color: colors.grey[100],
                    margin: "5px 0",
                  }}
                >
                  {!isCollapsed && (
                    <Typography>Logout</Typography>
                  )}
                </MenuItem>
              </Box>
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  )
}

export default Sidebar
