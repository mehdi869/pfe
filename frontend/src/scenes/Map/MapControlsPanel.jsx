import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  TextField,
  InputAdornment,
  IconButton,
  Paper as MuiPaper, // Paper is imported as MuiPaper
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  useTheme,
  Collapse, // Added Collapse
  Grid // Added Grid
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material"; // Import Clear icon
import { ChevronDown, ChevronUp } from "lucide-react";

const MapControlsPanel = React.memo(
  ({
    viewMode,
    onViewModeChange,
    minResponses,
    onMinResponsesChange,
    maxResponses,
    onMaxResponsesChange, // New prop
    themeColors,
    // searchValue,
    searchTerm,
    onSearchTermChange,
    onClearSearch,
    citySuggestions,
    onSuggestionClick
  }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(true);
    const [currentViewMode, setCurrentViewMode] = useState(viewMode);

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };

    return (
      <MuiPaper // Changed Paper to MuiPaper
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "0 1px 5px rgba(0,0,0,0.07)", // Softer shadow
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5, // Reduced padding
            borderBottom: expanded ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              fontSize: "1rem", // Reduced font size
            }}
          >
            Map Controls
          </Typography>
          <IconButton
            onClick={toggleExpanded}
            aria-label={expanded ? "Collapse controls" : "Expand controls"}
            sx={{
              minWidth: "36px", // Reduced size
              minHeight: "36px", // Reduced size
              color: theme.palette.text.secondary,
            }}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ p: 1.5 }}> {/* Reduced padding */}
            <Box sx={{ mb: 2 }}> {/* Reduced margin */}
              <Typography
                gutterBottom
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.9rem", // Reduced font size
                  mb: 1, // Reduced margin
                }}
              >
                View Mode
              </Typography>
              <ToggleButtonGroup
                value={currentViewMode}
                exclusive
                onChange={(event, newMode) => { if (newMode) onViewModeChange(newMode);}}
                aria-label="View mode"
                fullWidth
                sx={{ height: "40px" }} // Reduced height
              >
                <ToggleButton
                  value="cities"
                  aria-label="Cities view"
                  sx={{
                    color: theme.palette.text.primary,
                    "&.Mui-selected": {
                      backgroundColor: themeColors.primary[500],
                      color: "white",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: themeColors.primary[600],
                    },
                    minHeight: "36px", // Reduced height
                    fontSize: "0.9rem", // Reduced font size
                    p: '0 12px'
                  }}
                >
                  CITIES
                </ToggleButton>
                <ToggleButton
                  value="regions"
                  aria-label="Regions view"
                  sx={{
                    color: theme.palette.text.primary,
                    "&.Mui-selected": {
                      backgroundColor: themeColors.primary[500],
                      color: "white",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: themeColors.primary[600],
                    },
                    minHeight: "36px", // Reduced height
                    fontSize: "0.9rem", // Reduced font size
                    p: '0 12px'
                  }}
                >
                  REGIONS
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Search Input Field */}
            <Box sx={{ mt: 2, mb: 1, position: 'relative' }}>
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.9rem",
                  mb: 1,
                }}
              >
                Search City
              </Typography>
              <TextField
                label="Search City"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={onSearchTermChange}
                placeholder="Enter city name..."
                InputProps={{
                  sx: { height: "40px", fontSize: "0.9rem" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={onClearSearch} size="small">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: theme.palette.mode === 'dark' ? themeColors.grey[600] : themeColors.grey[400] },
                    "&:hover fieldset": { borderColor: themeColors.primary[500] },
                    "&.Mui-focused fieldset": { borderColor: themeColors.primary[500] },
                    backgroundColor: theme.palette.background.default, // Adjusted for better contrast potentially
                  },
                }}
              />
              {citySuggestions.length > 0 && (
                <MuiPaper
                  elevation={3}
                  sx={{
                    position: 'absolute',
                    top: '100%', // Position below the TextField
                    left: 0,
                    right: 0,
                    zIndex: 1200, // Ensure it's above other elements
                    mt: 0.5,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <List dense disablePadding>
                    {citySuggestions.map((suggestion, index) => (
                      <ListItemButton key={index} onClick={() => onSuggestionClick(suggestion)} dense>
                        <ListItemText primary={suggestion} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </MuiPaper>
              )}
            </Box>

            {/* Display Search Tag */}
            {searchTerm && citySuggestions.length === 0 && ( // Show tag when search term is set and no suggestions are active (i.e., a term is "committed")
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label={searchTerm}
                  onDelete={onClearSearch}
                  color="primary"
                  size="small"
                  sx={{ backgroundColor: themeColors.primary[500], color: 'white' }}
                />
              </Box>
            )}
            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.9rem", // Reduced font size
                mb: 1, // Reduced margin
              }}
            >
              Filters
            </Typography>

            <Box sx={{ mb: 1.5 }}> {/* Reduced margin */}
              <Typography
                gutterBottom
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 1, // Reduced margin
                  fontSize: "0.85rem", // Reduced font size
                }}
              >
                Response Count Range
              </Typography>
              <Grid container spacing={1.5}> {/* Reduced spacing */}
                <Grid item xs={6}>
                  <TextField
                    label="Min Responses"
                    type="number"
                    value={minResponses}
                    onChange={onMinResponsesChange}
                    fullWidth
                    placeholder="e.g., 0"
                    size="small"
                    InputProps={{
                      inputProps: { min: 0 },
                      sx: { height: "40px" }, // Reduced height
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.mode === 'dark' ? themeColors.grey[600] : themeColors.grey[400] },
                        "&:hover fieldset": { borderColor: themeColors.primary[500] },
                        "&.Mui-focused fieldset": { borderColor: themeColors.primary[500] },
                        backgroundColor: theme.palette.background.paper,
                      },
                      "& .MuiInputLabel-root": { fontSize: "0.9rem", color: theme.palette.text.secondary }, // Reduced font size
                      "& .MuiInputBase-input": { color: theme.palette.text.primary, fontSize: "0.9rem" }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max Responses"
                    type="number"
                    value={maxResponses === Infinity ? "" : maxResponses} // Show empty if Infinity
                    onChange={onMaxResponsesChange}
                    fullWidth
                    placeholder="e.g., 1000"
                    size="small"
                    InputProps={{
                      inputProps: { min: 0 },
                      sx: { height: "40px" }, // Reduced height
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.mode === 'dark' ? themeColors.grey[600] : themeColors.grey[400] },
                        "&:hover fieldset": { borderColor: themeColors.primary[500] },
                        "&.Mui-focused fieldset": { borderColor: themeColors.primary[500] },
                        backgroundColor: theme.palette.background.paper,
                      },
                      "& .MuiInputLabel-root": { fontSize: "0.9rem", color: theme.palette.text.secondary }, // Reduced font size
                      "& .MuiInputBase-input": { color: theme.palette.text.primary, fontSize: "0.9rem" }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Collapse>
      </MuiPaper>
    );
  },
);

export default MapControlsPanel;