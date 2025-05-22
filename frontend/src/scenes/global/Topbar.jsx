import { Box, IconButton, useTheme, Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { ThemeCustomizationContext,tokens } from "../../styles/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTopbar, TOPBAR_HEIGHT } from "../../context/TopbarContext"; // Import useTopbar and TOPBAR_HEIGHT

const Topbar = ({ setIsSider, isSiderCollapsed }) => { // Removed unused isSider prop, kept isSiderCollapsed for consistency if used elsewhere
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ThemeCustomizationContext); 
   const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { isTopbarExternallyControlled, isTopbarCollapsed } = useTopbar();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    // navigate('/'); // Optional: Redirect
  };

  const handleSettings = () => {
    navigate('/setting');
    handleClose();
  };

  const handleHelp = () => {
    navigate('/faq');
    handleClose();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: colors.primary[1000], // Or theme.palette.background.paper
        position: isTopbarExternallyControlled ? "absolute" : "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        height: isTopbarExternallyControlled ? TOPBAR_HEIGHT : "auto",
        transform: isTopbarExternallyControlled && isTopbarCollapsed ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.5s ease-in-out, background-color 0.3s ease",
        boxSizing: 'border-box',
        boxShadow: isTopbarExternallyControlled && !isTopbarCollapsed ? theme.shadows[2] : "none",
      }}
    >
      <Box flexGrow={1} /> {/* Add a flexible box to push icons to the right */}

      {/* ICONS */}
      <Box display="flex" alignItems="center"> {/* Ensure vertical alignment */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        
        {/* Profile Dropdown */}
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{ ml: 1 }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary[500] }} src="/pages/register/logo.png" /> 
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <MenuItem onClick={handleSettings}>
            <SettingsOutlinedIcon sx={{ mr: 1.5 }} />
            <Typography>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleHelp}>
            <HelpOutlineIcon sx={{ mr: 1.5 }} />
            <Typography>Help & Feedback</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon sx={{ mr: 1.5 }} />
            <Typography>Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;