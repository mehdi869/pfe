import React, { useState } from "react";
import { Paper, Box, Typography, Grid, Divider, IconButton, Collapse, useTheme, Chip } from "@mui/material";
import { ChevronUp, ChevronDown, CheckCircle, Circle } from "lucide-react";
import { getNpsColor, getBubbleRadius, npsCategories as allNpsCategories } from "../../utils/mapUtils"; // Import npsCategories

const responseExamples = [
  { label: "Few Responses (e.g., <10)", count: 5 },
  { label: "Some Responses (e.g., <50)", count: 25 },
  { label: "Many Responses (e.g., <100)", count: 75 },
  { label: "Lots of Responses (e.g., 500+)", count: 500 },
];

const MapLegendDisplay = React.memo(({ themeColors, selectedNpsCategoryIds, onNpsCategoryChange }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCategoryClick = (categoryId) => {
    onNpsCategoryChange(categoryId);
  };

  return (
    <Paper
      elevation={0}
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
          Legend & Filter
        </Typography>
        <IconButton
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse legend" : "Expand legend"}
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
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1, // Reduced margin
              fontSize: "0.9rem", // Reduced font size
            }}
          >
            NPS Score Category (Click to filter)
          </Typography>

          <Grid container spacing={0.5}> {/* Reduced spacing */}
            {allNpsCategories.map((category) => {
              const isSelected = selectedNpsCategoryIds.includes(category.id);
              return (
                <Grid item xs={12} sm={6} key={category.id}>
                  <Box
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5, // Reduced margin
                      minHeight: "28px", // Reduced height
                      cursor: "pointer",
                      p: 0.5, // Reduced padding
                      borderRadius: "4px",
                      backgroundColor: isSelected ? theme.palette.action.hover : "transparent",
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 16, // Reduced size
                        height: 16, // Reduced size
                        backgroundColor: getNpsColor(category.scoreForColor, themeColors),
                        mr: 1, // Reduced margin
                        borderRadius: "3px", // Adjusted border radius
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.85rem", // Reduced font size
                        flexGrow: 1,
                      }}
                    >
                      {category.label}
                    </Typography>
                    {isSelected ? (
                      <CheckCircle size={16} color={themeColors.greenAccent[500]} /> // Reduced size
                    ) : (
                      <Circle size={16} color={theme.palette.action.disabled} /> // Reduced size
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} /> {/* Reduced margin */}

          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1, // Reduced margin
              fontSize: "0.9rem", // Reduced font size
            }}
          >
            Response Count (Bubble Size)
          </Typography>

          {responseExamples.map((ex) => (
            <Box
              key={ex.label}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1, // Reduced margin
                minHeight: "36px", // Reduced height
              }}
            >
              <Box
                sx={{
                  width: getBubbleRadius(ex.count) * 1.8, // Slightly smaller bubbles for legend
                  height: getBubbleRadius(ex.count) * 1.8, // Slightly smaller bubbles for legend
                  backgroundColor: themeColors.primary[500],
                  borderRadius: "50%",
                  mr: 1.5, // Reduced margin
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.85rem", // Reduced font size
                }}
              >
                {ex.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
});

export default MapLegendDisplay;