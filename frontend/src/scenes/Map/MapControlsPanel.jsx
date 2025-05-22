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

    // Removed handleNpsMinChange and handleNpsMaxChange

    return (
      <Paper
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: expanded ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Map Controls
          </Typography>
          <IconButton
            onClick={toggleExpanded}
            aria-label={expanded ? "Collapse controls" : "Expand controls"}
            sx={{
              minWidth: "44px",
              minHeight: "44px",
              color: theme.palette.text.secondary,
            }}
          >
            {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                gutterBottom
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "1rem",
                  mb: 1.5,
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
                sx={{ height: "48px" }}
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
                    minHeight: "44px",
                    fontSize: "1rem",
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
                    minHeight: "44px",
                    fontSize: "1rem",
                  }}
                >
                  REGIONS
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "1rem",
                mb: 1.5,
              }}
            >
              Filters
            </Typography>

            {/* NPS Score Range Removed */}

            <Box sx={{ mb: 2 }}>
              <Typography
                gutterBottom
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 1.5,
                  fontSize: "0.95rem",
                }}
              >
                Response Count Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Min Responses"
                    type="number"
                    value={minResponses}
                    onChange={onMinResponsesChange}
                    fullWidth
                    placeholder="e.g., 0"
                    InputProps={{
                      inputProps: { min: 0 },
                      sx: { height: "48px" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.mode === 'dark' ? themeColors.grey[600] : themeColors.grey[400] },
                        "&:hover fieldset": { borderColor: themeColors.primary[500] },
                        "&.Mui-focused fieldset": { borderColor: themeColors.primary[500] },
                        backgroundColor: theme.palette.background.paper,
                      },
                      "& .MuiInputLabel-root": { fontSize: "1rem", color: theme.palette.text.secondary },
                      "& .MuiInputBase-input": { color: theme.palette.text.primary }
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
                    InputProps={{
                      inputProps: { min: 0 },
                      sx: { height: "48px" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: theme.palette.mode === 'dark' ? themeColors.grey[600] : themeColors.grey[400] },
                        "&:hover fieldset": { borderColor: themeColors.primary[500] },
                        "&.Mui-focused fieldset": { borderColor: themeColors.primary[500] },
                        backgroundColor: theme.palette.background.paper,
                      },
                      "& .MuiInputLabel-root": { fontSize: "1rem", color: theme.palette.text.secondary },
                      "& .MuiInputBase-input": { color: theme.palette.text.primary }
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