import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, useTheme, Alert } from "@mui/material";
import { tokens } from "../../styles/theme"; // Assuming tokens are used for themeColors
import { getNpsColor } from "../../utils/mapUtils"; // For NPS score based coloring

const RegionStatsList = React.memo(({ regionData, themeColors }) => {
  const theme = useTheme();
  // If themeColors are not directly passed, derive them from the theme if needed.
  // const colors = themeColors || tokens(theme.palette.mode); // Use passed themeColors or derive

  if (!regionData || regionData.length === 0) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Alert severity="info" sx={{ width: '100%', justifyContent: 'center' }}>
          No region data to display for the current filters.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        overflowY: "auto",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid container spacing={2}>
        {regionData.map((region) => {
          const npsScore = region.avg_nps; // This is the calculated NPS score
          const cardBgColor = npsScore !== null ? getNpsColor(npsScore, themeColors) : themeColors.grey[700];
          // Determine text color based on background for better contrast
          const textColor = theme.palette.getContrastText(cardBgColor);

          return (
            <Grid item xs={12} key={region.name}>
              <Card
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderLeft: `5px solid ${cardBgColor}`,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 1 }}
                  >
                    {region.name === "-1" ? "Overall (All Regions)" : region.name}
                  </Typography>

                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h4" sx={{ color: cardBgColor, fontWeight: "bold" }}>
                        {npsScore !== null ? npsScore.toFixed(1) : "N/A"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Avg. NPS
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Total Responses:{" "}
                        <Typography component="span" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                          {region.total_responses.toLocaleString()}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Promoters:{" "}
                        <Typography component="span" sx={{ color: themeColors.greenAccent[500], fontWeight: "medium" }}>
                          {region.promoters.toLocaleString()}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Passives:{" "}
                        <Typography component="span" sx={{ color: themeColors.blueAccent[400], fontWeight: "medium" }}>
                          {region.passives.toLocaleString()}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Detractors:{" "}
                        <Typography component="span" sx={{ color: themeColors.redAccent[500], fontWeight: "medium" }}>
                          {region.detractors.toLocaleString()}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
});

export default RegionStatsList;