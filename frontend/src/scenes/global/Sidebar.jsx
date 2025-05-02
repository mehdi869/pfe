import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Avatar, Divider, Badge, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from "../../styles/theme";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import CommentIcon from "@mui/icons-material/Comment";
import CompareIcon from "@mui/icons-material/Compare";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const Item = ({ title, to, icon, selected, setSelected, badge }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const isActive = location.pathname === to;

  useEffect(() => {
    if (isActive) {
      setSelected(title);
    }
  }, [isActive, setSelected, title]);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
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
              }
            }}
          >
            {icon}
          </Badge>
        ) : icon
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
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();

  // Set selected based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/Dashboard") setSelected("Dashboard");
    else if (path === "/nps-overview") setSelected("NPS Overview");
    else if (path === "/response-analysis") setSelected("Response Analysis");
    else if (path === "/segmentation") setSelected("Segmentation");
    else if (path === "/trends") setSelected("Trends & Forecasting");
    else if (path === "/comments") setSelected("Comment Analysis");
    else if (path === "/benchmarks") setSelected("Benchmarks");
    else if (path === "/team") setSelected("Team Management");
    else if (path === "/profile") setSelected("Profile");
    else if (path === "/barChart") setSelected("Bar Chart");
    else if (path === "/pie") setSelected("Pie Chart");
    else if (path === "/line") setSelected("Line Chart");
    else if (path === "/Map") setSelected("Geography Chart");
  }, [location]);

  return (
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
      }}
    >
      <ProSidebar 
        collapsed={isCollapsed} 
        width="250px" 
        collapsedWidth="80px"
        style={{ 
          height: "100%",
          transition: "all 0.3s ease",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box display="flex" alignItems="center">
                  <img 
                    src="assets\logo.png" 
                    alt="Djezzy Logo" 
                    style={{ 
                      height: "30px", 
                      marginRight: "10px" 
                    }} 
                  />
                  <Typography 
                    variant="h3" 
                    color={colors.primary[500]}
                    fontWeight="bold"
                  >
                    DJEZZY NPS
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  alt="Profile User"
                  src="/pages/register/logo.png"
                  sx={{ 
                    width: 70, 
                    height: 70,
                    border: `3px solid ${colors.primary[500]}`,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Box>
              <Box textAlign="center" mt="10px">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin User
                </Typography>
                <Typography 
                  variant="body2" 
                  color={colors.primary[500]}
                  fontWeight="500"
                >
                  NPS Administrator
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* DASHBOARD */}
            <Item
              title="Dashboard"
              to="/Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          <Item
            title="NPS Overview"
            to="/nps-overview"
            icon={<InsightsIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          {/*
          <Item
            title="Response Analysis"
            to="/response-analysis"
            icon={<AnalyticsIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Segmentation"
            to="/segmentation"
            icon={<GroupsIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Trends & Forecasting"
            to="/trends"
            icon={<TrendingUpIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Comment Analysis"
            to="/comments"
            icon={<CommentIcon />}
            selected={selected}
            setSelected={setSelected}
            badge={5}
          />
          <Item
            title="Benchmarks"
            to="/benchmarks"
            icon={<CompareIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          */}     
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
              title="Bar Chart"
              to="/barChart"
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
              to="/line"
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
            <Item
              title="Team Management"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
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
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;