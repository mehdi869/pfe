import { useState, useContext } from "react";
import { Box, Button, Typography, useTheme, Grid, Card, CardContent, TextField, Avatar, IconButton, Divider, Tab, Tabs, List, ListItem, ListItemText, ListItemIcon, Snackbar, Alert } from "@mui/material";
import { tokens } from "../../styles/theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  
  // State for profile data
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@djezzy.com",
    phone: "+213 555 123 456",
    role: "NPS Administrator",
    department: "Customer Experience",
    joinDate: "15 Jan 2022",
  });
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  // Mock login history
  const loginHistory = [
    { date: "2023-05-15 09:32:15", action: "Login", device: "Chrome / Windows" },
    { date: "2023-05-14 17:45:22", action: "Logout", device: "Chrome / Windows" },
    { date: "2023-05-14 08:15:37", action: "Login", device: "Chrome / Windows" },
    { date: "2023-05-13 18:22:05", action: "Logout", device: "Safari / iOS" },
    { date: "2023-05-13 12:11:52", action: "Login", device: "Safari / iOS" },
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({...profile});
    }
    setIsEditing(!isEditing);
  };
  
  // Handle profile update
  const handleProfileUpdate = () => {
    setProfile({...editedProfile});
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: "Profile updated successfully!",
      severity: "success"
    });
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };
  
  // Handle password change
  const handlePasswordChange = () => {
    setSnackbar({
      open: true,
      message: "Password reset link sent to your email!",
      severity: "info"
    });
  };
  
  // Handle profile picture change
  const handleProfilePictureChange = () => {
    setSnackbar({
      open: true,
      message: "Profile picture updated!",
      severity: "success"
    });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="PROFILE" subtitle="Manage your account information" />
        
        {isEditing ? (
          <Box>
            <Button
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
                mr: 1,
                "&:hover": {
                  backgroundColor: colors.greenAccent[700],
                },
              }}
              onClick={handleProfileUpdate}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              sx={{
                backgroundColor: colors.grey[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: colors.grey[600],
                },
              }}
              onClick={handleEditToggle}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          </Box>
        ) : (
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
            }}
            onClick={handleEditToggle}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        )}
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
          <Tab label="Personal Information" />
          <Tab label="Security" />
          <Tab label="Activity Log" />
        </Tabs>
      </Box>

      {/* PERSONAL INFORMATION TAB */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* PROFILE PICTURE */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                height: "100%",
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src="/pages/register/logo.png"
                    sx={{ 
                      width: 150, 
                      height: 150,
                      border: `4px solid ${colors.primary[500]}`,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      mb: 2
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: colors.primary[500],
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: colors.primary[600],
                      },
                    }}
                    onClick={handleProfilePictureChange}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                  {user ? `${user.first_name} ${user.last_name}` : ""}
                </Typography>
                <Typography variant="body1" color={colors.grey[100]}>
                  {profile.role}
                </Typography>
                <Typography variant="body2" color={colors.primary[500]}>
                  {profile.department}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box textAlign="left">
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1, color: colors.primary[500] }} />
                    <Typography variant="body2" color={colors.grey[100]}>
                      Joined: {profile.joinDate}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <WorkIcon sx={{ mr: 1, color: colors.primary[500] }} />
                    <Typography variant="body2" color={colors.grey[100]}>
                      Department: {profile.department}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* PROFILE DETAILS */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={isEditing ? editedProfile.firstName : profile.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={isEditing ? editedProfile.lastName : profile.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={isEditing ? editedProfile.phone : profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Role"
                      name="role"
                      value={isEditing ? editedProfile.role : profile.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <WorkIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={isEditing ? editedProfile.department : profile.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <WorkIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* SECURITY TAB */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Change Password
                </Typography>
                
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: colors.primary[500] }} />,
                  }}
                />
                
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: colors.primary[500],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    "&:hover": {
                      backgroundColor: colors.primary[600],
                    },
                  }}
                  onClick={handlePasswordChange}
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Two-Factor Authentication
                </Typography>
                
                <Typography variant="body1" mb={2}>
                  Enhance your account security by enabling two-factor authentication.
                </Typography>
                
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[700],
                    },
                    mb: 2,
                  }}
                >
                  Enable Two-Factor Authentication
                </Button>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Sessions
                </Typography>
                
                <Typography variant="body1" mb={2}>
                  You are currently logged in on this device.
                </Typography>
                
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: colors.redAccent[600],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    "&:hover": {
                      backgroundColor: colors.redAccent[700],
                    },
                  }}
                >
                  Log Out All Other Devices
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ACTIVITY LOG TAB */}
      {tabValue === 2 && (
        <Card
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "10px",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Recent Activity
            </Typography>
            
            <List>
              {loginHistory.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < loginHistory.length - 1 ? `1px solid ${colors.grey[800]}` : "none",
                    py: 1,
                  }}
                >
                  <ListItemIcon>
                    {item.action === "Login" ? (
                      <LoginIcon sx={{ color: colors.greenAccent[500] }} />
                    ) : (
                      <LogoutIcon sx={{ color: colors.redAccent[500] }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.action}
                    secondary={
                      <Box component="span" display="flex" justifyContent="space-between">
                        <Typography variant="body2" component="span">
                          {item.device}
                        </Typography>
                        <Typography variant="body2" component="span" color={colors.grey[400]}>
                          {item.date}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;