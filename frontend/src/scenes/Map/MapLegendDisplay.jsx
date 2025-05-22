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
          Legend
        </Typography>
        <IconButton
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse legend" : "Expand legend"}
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
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1.5,
              fontSize: "1rem",
            }}
          >
            NPS Score Category (Click to filter)
          </Typography>

          <Grid container spacing={1}>
            {allNpsCategories.map((category) => {
              const isSelected = selectedNpsCategoryIds.includes(category.id);
              return (
                <Grid item xs={12} sm={6} key={category.id}>
                  <Box
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      minHeight: "32px",
                      cursor: "pointer",
                      p: 0.5,
                      borderRadius: "4px",
                      backgroundColor: isSelected ? theme.palette.action.hover : "transparent",
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: getNpsColor(category.scoreForColor, themeColors),
                        mr: 1.5,
                        borderRadius: "4px",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.90rem", // Adjusted size
                        flexGrow: 1,
                      }}
                    >
                      {category.label}
                    </Typography>
                    {isSelected ? (
                      <CheckCircle size={18} color={themeColors.greenAccent[500]} />
                    ) : (
                      <Circle size={18} color={theme.palette.action.disabled} />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Divider sx={{ my: 2.5, borderColor: theme.palette.divider }} />

          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1.5,
              fontSize: "1rem",
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
                mb: 1.5,
                minHeight: "44px",
              }}
            >
              <Box
                sx={{
                  width: getBubbleRadius(ex.count) * 2,
                  height: getBubbleRadius(ex.count) * 2,
                  backgroundColor: themeColors.primary[500],
                  borderRadius: "50%",
                  mr: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.95rem",
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