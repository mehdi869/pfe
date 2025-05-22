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
        return <AlertTriangle size={24} color={themeColors.redAccent[500]} />;
      case "success":
        return <TrendingUp size={24} color={themeColors.greenAccent[500]} />;
      case "info":
        return <Info size={24} color={themeColors.blueAccent[500]} />;
      default:
        return <Info size={24} color={themeColors.blueAccent[500]} />;
    }
  };

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
          Analysis Insights
        </Typography>
        <IconButton
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse insights" : "Expand insights"}
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
          {insights.map((insight, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
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
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  {getIconForType(insight.type)}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      ml: 1.5,
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {insight.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1.5,
                    fontSize: "0.95rem",
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
                        py: 0.75,
                        minHeight: "44px",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <MapPin size={20} color={themeColors.primary[500]} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={item.value}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: "medium",
                          fontSize: "0.95rem",
                          color: theme.palette.text.primary,
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          fontSize: "0.85rem",
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