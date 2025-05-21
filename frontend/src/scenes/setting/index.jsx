import { useState } from "react";
import { Box, Button, Typography, useTheme, Grid, Card, CardContent, Switch, FormControlLabel, FormGroup, Select, MenuItem, InputLabel, FormControl, Divider, Snackbar, Alert, TextField, IconButton } from "@mui/material";
import { tokens } from "../../styles/theme";
import Header from "../../components/Header";
import SaveIcon from "@mui/icons-material/Save";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../../styles/theme";
import { useContext } from "react";
import { exportToExcel } from "../../utils/utility";

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  // State for settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      monthlyReport: true,
    },
    privacy: {
      profileVisibility: "public",
      activityVisibility: "team",
      showEmail: false,
      showPhone: false,
    },
    appearance: {
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: "30m",
    }
  });
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  // Handle settings change
  const handleSettingChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    setSnackbar({
      open: true,
      message: "Settings saved successfully!",
      severity: "success"
    });
  };
  
  // Handle data export
  const handleDataExport = () => {
    // Prepare data for export (flatten settings object)
    const rows = Object.entries(settings).flatMap(([category, values]) =>
      Object.entries(values).map(([key, value]) => ({
        Category: category.charAt(0).toUpperCase() + category.slice(1),
        Setting: key,
        Value: typeof value === "boolean" ? (value ? "Yes" : "No") : value,
      }))
    );

    exportToExcel({
      rows,
      sheetName: "UserSettings",
      fileName: "user_settings.xlsx",
    });

    setSnackbar({
      open: true,
      message: "Your data has been exported as Excel.",
      severity: "success",
    });
  };
  
  // Handle account deletion
  const handleAccountDeletion = () => {
    setSnackbar({
      open: true,
      message: "Account deletion request submitted. An administrator will contact you.",
      severity: "warning"
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
        <Header title="SETTINGS" subtitle="Configure your application preferences" />
        
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
          onClick={handleSaveSettings}
          startIcon={<SaveIcon />}
        >
          Save Settings
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* NOTIFICATIONS */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationsIcon sx={{ color: colors.primary[500], mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Notification Preferences
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                
                <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
                  Reports
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.weeklyReport}
                      onChange={(e) => handleSettingChange("notifications", "weeklyReport", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Weekly NPS Report"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.monthlyReport}
                      onChange={(e) => handleSettingChange("notifications", "monthlyReport", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Monthly NPS Summary"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
        
        {/* APPEARANCE */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <LanguageIcon sx={{ color: colors.primary[500], mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Appearance & Localization
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.appearance.language}
                  label="Language"
                  onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="ar">Arabic</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.appearance.dateFormat}
                  label="Date Format"
                  onChange={(e) => handleSettingChange("appearance", "dateFormat", e.target.value)}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time Format</InputLabel>
                <Select
                  value={settings.appearance.timeFormat}
                  label="Time Format"
                  onChange={(e) => handleSettingChange("appearance", "timeFormat", e.target.value)}
                >
                  <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                  <MenuItem value="24h">24-hour</MenuItem>
                </Select>
              </FormControl>
              
              <Box display="flex" alignItems="center" mt={3}>
                <Typography variant="body1" mr={2}>
                  Theme Mode:
                </Typography>
                <Button
                  onClick={colorMode.toggleColorMode}
                  startIcon={theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                  variant="outlined"
                  sx={{
                    borderColor: colors.primary[500],
                    color: colors.primary[500],
                    "&:hover": {
                      borderColor: colors.primary[600],
                      backgroundColor: "rgba(237, 28, 36, 0.04)",
                    },
                  }}
                >
                  {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* PRIVACY */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <VisibilityIcon sx={{ color: colors.primary[500], mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Privacy Settings
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy.profileVisibility}
                  label="Profile Visibility"
                  onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="team">Team Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Activity Visibility</InputLabel>
                <Select
                  value={settings.privacy.activityVisibility}
                  label="Activity Visibility"
                  onChange={(e) => handleSettingChange("privacy", "activityVisibility", e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="team">Team Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.showEmail}
                      onChange={(e) => handleSettingChange("privacy", "showEmail", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Show Email to Others"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.showPhone}
                      onChange={(e) => handleSettingChange("privacy", "showPhone", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Show Phone Number to Others"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
        
        {/* SECURITY */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon sx={{ color: colors.primary[500], mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Security Settings
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.loginNotifications}
                      onChange={(e) => handleSettingChange("security", "loginNotifications", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Login Notifications"
                />
              </FormGroup>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Session Timeout</InputLabel>
                <Select
                  value={settings.security.sessionTimeout}
                  label="Session Timeout"
                  onChange={(e) => handleSettingChange("security", "sessionTimeout", e.target.value)}
                >
                  <MenuItem value="15m">15 minutes</MenuItem>
                  <MenuItem value="30m">30 minutes</MenuItem>
                  <MenuItem value="1h">1 hour</MenuItem>
                  <MenuItem value="4h">4 hours</MenuItem>
                  <MenuItem value="never">Never</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        
        {/* DATA MANAGEMENT */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Data Management
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Export Your Data
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      Download a copy of your personal data including profile information, activity history, and preferences.
                    </Typography>
                    <Button
                      startIcon={<CloudDownloadIcon />}
                      variant="outlined"
                      onClick={handleDataExport}
                      sx={{
                        borderColor: colors.primary[500],
                        color: colors.primary[500],
                        "&:hover": {
                          borderColor: colors.primary[600],
                          backgroundColor: "rgba(237, 28, 36, 0.04)",
                        },
                      }}
                    >
                      Export Data
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color={colors.redAccent[500]} mb={1}>
                      Delete Account
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </Typography>
                    <Button
                      startIcon={<DeleteIcon />}
                      variant="outlined"
                      onClick={handleAccountDeletion}
                      sx={{
                        borderColor: colors.redAccent[500],
                        color: colors.redAccent[500],
                        "&:hover": {
                          borderColor: colors.redAccent[600],
                          backgroundColor: "rgba(211, 47, 47, 0.04)",
                        },
                      }}
                    >
                      Request Account Deletion
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default Settings;