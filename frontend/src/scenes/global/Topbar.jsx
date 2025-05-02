import { Box, IconButton, useTheme, Menu, MenuItem, Avatar, Typography } from "@mui/material"; // Added Menu, MenuItem, Avatar, Typography
import { useContext, useState } from "react"; // Added useState
import { ColorModeContext, tokens } from "../../styles/theme";
// Removed InputBase and SearchIcon imports as they are no longer used
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// Removed PersonOutlinedIcon import as Avatar is used
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Added for Logout
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Added for Help
import { AuthContext } from "../../context/AuthContext"; // Added AuthContext
import { useNavigate } from "react-router-dom"; // Added useNavigate

const Topbar = ({ setIsSider }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useContext(AuthContext); // Get logout function
  const navigate = useNavigate(); // Hook for navigation

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    // Optional: Redirect to login page after logout
    // navigate('/'); 
  };

  const handleSettings = () => {
    navigate('/setting'); // Navigate to settings page
    handleClose();
  };

  const handleHelp = () => {
    navigate('/faq'); // Navigate to help page
    handleClose();
  };


  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* REMOVED SEARCH BAR */}
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
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        {/* Removed Settings and Person IconButtons */}
        
        {/* Profile Dropdown */}
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{ ml: 1 }} // Add some margin
        >
          {/* Using Avatar, replace src with actual user image if available */}
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
              mt: 1.5, // Margin top for spacing
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              backgroundColor: theme.palette.background.paper, // Use theme background
              boxShadow: theme.shadows[3], // Add some shadow
            },
          }}
        >
          <MenuItem onClick={handleSettings}>
            <SettingsOutlinedIcon sx={{ mr: 1.5 }} /> {/* Add icon */}
            <Typography>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleHelp}>
            <HelpOutlineIcon sx={{ mr: 1.5 }} /> {/* Add icon */}
            <Typography>Help & Feedback</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon sx={{ mr: 1.5 }} /> {/* Add icon */}
            <Typography>Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;