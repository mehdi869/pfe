import React, { useMemo, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import { AlertTriangle, TrendingUp, Info, MapPin, ChevronUp, ChevronDown } from "lucide-react";

const AnalysisInsights = React.memo(({ cityData, regionData, themeColors }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const insights = useMemo(() => {
    const results = [];

    const lowNpsHighResponseCities = cityData
      .filter((city) => city.avg_nps !== null && city.avg_nps < 0 && city.total_responses > 50)
      .sort((a, b) => a.avg_nps - b.avg_nps)
      .slice(0, 3);

    if (lowNpsHighResponseCities.length > 0) {
      results.push({
        type: "warning",
        title: "Critical Attention Needed",
        description: "These cities have negative NPS scores with significant response volumes:",
        items: lowNpsHighResponseCities.map((city) => ({
          name: city.name,
          value: `NPS: ${city.avg_nps.toFixed(1)} (${city.total_responses} responses)`,
        })),
      });
    }

    const highNpsCities = cityData
      .filter((city) => city.avg_nps !== null && city.avg_nps > 75 && city.total_responses > 20)
      .sort((a, b) => b.avg_nps - a.avg_nps)
      .slice(0, 3);

    if (highNpsCities.length > 0) {
      results.push({
        type: "success",
        title: "Top Performing Cities",
        description: "These cities have excellent NPS scores:",
        items: highNpsCities.map((city) => ({
          name: city.name,
          value: `NPS: ${city.avg_nps.toFixed(1)} (${city.total_responses} responses)`,
        })),
      });
    }

    const lowResponseCities = cityData
      .filter((city) => city.total_responses < 10 && city.name.length > 5)
      .sort((a, b) => a.total_responses - b.total_responses)
      .slice(0, 3);

    if (lowResponseCities.length > 0) {
      results.push({
        type: "info",
        title: "Low Response Rates",
        description: "These cities have fewer responses than expected:",
        items: lowResponseCities.map((city) => ({
          name: city.name,
          value: `Only ${city.total_responses} responses`,
        })),
      });
    }

    return results;
  }, [cityData, regionData]);

  if (insights.length === 0) {
    return null;
  }

  const getIconForType = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} color={themeColors.redAccent[500]} />; // Reduced size
      case "success":
        return <TrendingUp size={20} color={themeColors.greenAccent[500]} />; // Reduced size
      case "info":
        return <Info size={20} color={themeColors.blueAccent[500]} />; // Reduced size
      default:
        return <Info size={20} color={themeColors.blueAccent[500]} />; // Reduced size
    }
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
          Analysis Insights
        </Typography>
        <IconButton
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse insights" : "Expand insights"}
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
        <Box sx={{ p: 1.5, pt: 1 }}> {/* Reduced padding, slightly less top padding */}
          {insights.map((insight, index) => (
            <Card
              key={index}
              sx={{
                mb: 1.5, // Reduced margin
                border: `1px solid ${
                  insight.type === "warning"
                    ? themeColors.redAccent[300]
                    : insight.type === "success"
                    ? themeColors.greenAccent[300]
                    : themeColors.blueAccent[300]
                }`,
                boxShadow: "none",
                backgroundColor: theme.palette.background.default,
              }}
            >
              <CardContent sx={{ p: 2 }}> {/* Reduced padding */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}> {/* Reduced margin */}
                  {getIconForType(insight.type)}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      ml: 1, // Reduced margin
                      fontWeight: "bold",
                      fontSize: "0.95rem", // Reduced font size
                      color: theme.palette.text.primary,
                    }}
                  >
                    {insight.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1, // Reduced margin
                    fontSize: "0.85rem", // Reduced font size
                    color: theme.palette.text.secondary,
                  }}
                >
                  {insight.description}
                </Typography>
                <List dense disablePadding>
                  {insight.items.map((item, itemIndex) => (
                    <ListItem
                      key={itemIndex}
                      disablePadding
                      sx={{
                        py: 0.5, // Reduced padding
                        minHeight: "36px", // Reduced height
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30, mr: 0.5 }}> {/* Reduced width and margin */}
                        <MapPin size={18} color={themeColors.primary[500]} /> {/* Reduced size */}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={item.value}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: "medium",
                          fontSize: "0.85rem", // Reduced font size
                          color: theme.palette.text.primary,
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          fontSize: "0.75rem", // Reduced font size
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
});

export default AnalysisInsights;