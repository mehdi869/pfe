import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  // Chip, // Chip removed as NPS Score Range is gone
  useTheme,
  IconButton,
  Collapse,
} from "@mui/material";
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
  }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(true);

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };

    return (
      <Paper
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
                value={viewMode}
                exclusive
                onChange={onViewModeChange}
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

            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} /> {/* Reduced margin */}

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
      </Paper>
    );
  },
);

export default MapControlsPanel;