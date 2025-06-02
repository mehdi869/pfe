import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper as MuiPaper,
  useTheme,
} from "@mui/material";
import { fetchGeoNpsStats } from "../../API/api";
import cityLocationsData from "../../Data/cityLocations.json"; // Import city locations
import {
  getNpsColor,
  npsCategories,
  scoreIsInNpsCategory,
} from "../../utils/mapUtils"; // Updated imports
import { tokens } from "../../styles/theme";
import { mapDefaultCenter, mapDefaultZoom } from "../../constants/mapConfig";
import "../../styles/map.css";
import { useTopbar } from "../../context/TopbarContext"; // Import useTopbar
import { ExportButton } from "../chart/QuestionChart";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";

import CityBubbleMap from "./CityBubbleMap";
import RegionStatsList from "./RegionStatsList";
import MapControlsPanel from "./MapControlsPanel";
import MapLegendDisplay from "./MapLegendDisplay";
import AnalysisInsights from "./AnalysisInsights";

const AUTO_COLLAPSE_DELAY = 3000; // 3 seconds
const MOUSE_REVEAL_THRESHOLD_TOP = 50; // Pixels from top to reveal Topbar
const MOUSE_HIDE_THRESHOLD_OFFSET = 30; // Extra pixels to move mouse down before hiding

// Helper function to calculate NPS score (remains the same)
const calculateNpsScore = (promoters, detractors, total_responses) => {
  if (
    total_responses === 0 ||
    typeof promoters !== "number" ||
    typeof detractors !== "number" ||
    typeof total_responses !== "number"
  ) {
    return null;
  }
  const nps =
    (promoters / total_responses) * 100 - (detractors / total_responses) * 100;
  return parseFloat(nps.toFixed(2));
};

const Map = () => {
  const theme = useTheme();
  const themeColors = tokens(theme.palette.mode);
  const [npsStats, setNpsStats] = useState({ cities: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("cities");
  // const [npsRange, setNpsRange] = useState([-100, 100]); // Removed
  const [minResponses, setMinResponses] = useState(0);
  const [maxResponses, setMaxResponses] = useState(Infinity); // New state for max responses
  const [selectedNpsCategoryIds, setSelectedNpsCategoryIds] = useState(() =>
    npsCategories.map((cat) => cat.id)
  ); // New state, all selected by default
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const {
    setTopbarConfig,
    toggleTopbar,
    isTopbarExternallyControlled,
    isTopbarCollapsed,
  } = useTopbar();

  const isValidRawGeoNpsApiData = useCallback((data) => {
    // Validates the structure of raw data needed for processing
    const isValidItem = (item) =>
      item &&
      typeof item.name === "string" &&
      item.hasOwnProperty("promoters") &&
      item.hasOwnProperty("detractors") &&
      item.hasOwnProperty("total_responses");

    return (
      data &&
      typeof data === "object" &&
      Array.isArray(data.cities) &&
      Array.isArray(data.regions) &&
      data.cities.every(isValidItem) &&
      data.regions.every(isValidItem)
    );
  }, []);

  const processApiData = useCallback(
    (rawData) => {
      if (!isValidRawGeoNpsApiData(rawData)) {
        console.warn("Invalid raw data structure for processing.", rawData);
        return { cities: [], regions: [] };
      }
      return {
        cities: rawData.cities.map((city) => ({
          ...city,
          avg_nps: calculateNpsScore(
            city.promoters,
            city.detractors,
            city.total_responses
          ),
        })),
        regions: rawData.regions.map((region) => ({
          ...region,
          avg_nps: calculateNpsScore(
            region.promoters,
            region.detractors,
            region.total_responses
          ),
        })),
      };
    },
    [isValidRawGeoNpsApiData]
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const cacheKey = "geoNpsMapRawApiData_v1";

      try {
        let rawApiDataToProcess;
        const cachedDataString = localStorage.getItem(cacheKey);

        if (cachedDataString) {
          try {
            const parsedRawCachedData = JSON.parse(cachedDataString);
            if (isValidRawGeoNpsApiData(parsedRawCachedData)) {
              rawApiDataToProcess = parsedRawCachedData;
            } else {
              console.warn(
                "Cached raw GeoNPS data is invalid, removing from cache."
              );
              localStorage.removeItem(cacheKey);
            }
          } catch (e) {
            console.warn(
              "Failed to parse cached raw GeoNPS data, fetching new.",
              e
            );
            localStorage.removeItem(cacheKey);
          }
        }

        if (!rawApiDataToProcess) {
          const fetchedRawData = await fetchGeoNpsStats();
          if (isValidRawGeoNpsApiData(fetchedRawData)) {
            rawApiDataToProcess = fetchedRawData;
            localStorage.setItem(cacheKey, JSON.stringify(rawApiDataToProcess));
          } else {
            throw new Error("Fetched raw GeoNPS data structure is invalid.");
          }
        }

        const processedData = processApiData(rawApiDataToProcess);
        setNpsStats(processedData);
      } catch (err) {
        console.error("Error loading NPS geo stats:", err);
        setError(
          err.message || "An unknown error occurred while fetching map data."
        );
        setNpsStats({ cities: [], regions: [] });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isValidRawGeoNpsApiData, processApiData]);

  const allCityNames = useMemo(() => {
    if (!cityLocationsData) return [];
    return cityLocationsData.map((city) => city.ville);
  }, []);

  const mergedCityData = useMemo(() => {
    if (
      !npsStats.cities ||
      !npsStats.cities.length ||
      !cityLocationsData.length
    )
      return [];
    return cityLocationsData
      .map((location) => {
        const lat = Number.parseFloat(location.Latitude);
        const lon = Number.parseFloat(location.Longitude);

        if (isNaN(lat) || isNaN(lon) || !location.ville) {
          return null;
        }
        const cityStat = npsStats.cities.find((s) => s.name === location.ville);
        return {
          name: location.ville,
          latitude: lat,
          longitude: lon,
          avg_nps: cityStat ? cityStat.avg_nps : null,
          total_responses: cityStat ? cityStat.total_responses : 0,
          promoters: cityStat ? cityStat.promoters : 0,
          passives: cityStat ? cityStat.passives : 0,
          detractors: cityStat ? cityStat.detractors : 0,
        };
      })
      .filter((item) => item !== null);
  }, [npsStats.cities, cityLocationsData]);

  const handleSearchTermChange = (eventOrValue) => {
    const newTerm =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue.target.value;
    setSearchTerm(newTerm);
    if (newTerm) {
      const filteredSuggestions = allCityNames
        .filter((name) => name.toLowerCase().startsWith(newTerm.toLowerCase()))
        .slice(0, 3);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSearchTerm(cityName);
    setSuggestions([]);
    // Optionally, you might want to trigger a map focus/zoom to the selected city here
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  const filteredCityData = useMemo(() => {
    let dataToFilter = mergedCityData;

    if (searchTerm) {
      dataToFilter = dataToFilter.filter((city) =>
        city.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    return dataToFilter.filter((city) => {
      const nps = city.avg_nps;
      const responses = city.total_responses;

      // NPS Category Filter
      let npsCategoryMatch = false;
      if (selectedNpsCategoryIds.length === 0 && !searchTerm) {
        // If no categories and no search, show none
        npsCategoryMatch = false;
      } else if (selectedNpsCategoryIds.length === 0 && searchTerm) {
        // If search term exists, ignore category filter initially
        npsCategoryMatch = true;
      } else if (selectedNpsCategoryIds.length === npsCategories.length) {
        // Show all if all categories selected
        npsCategoryMatch = true;
      } else {
        npsCategoryMatch = selectedNpsCategoryIds.some((categoryId) => {
          const category = npsCategories.find((cat) => cat.id === categoryId);
          return category ? scoreIsInNpsCategory(nps, category) : false;
        });
      }

      if (searchTerm && selectedNpsCategoryIds.length === 0) {
        // If search term active and no categories selected, bypass category check
        npsCategoryMatch = true;
      }

      // Response Range Filter
      const responsesMeetCriteria =
        responses >= minResponses && responses <= maxResponses;

      return npsCategoryMatch && responsesMeetCriteria;
    });
  }, [mergedCityData, selectedNpsCategoryIds, minResponses, maxResponses, searchTerm, npsCategories]); // Added searchTerm and npsCategories

  const filteredRegionData = useMemo(() => {
    if (!npsStats.regions) return [];
    return npsStats.regions.filter((region) => {
      const nps = region.avg_nps;
      const responses = region.total_responses;

      // NPS Category Filter
      let npsCategoryMatch = false;
      if (selectedNpsCategoryIds.length === 0) {
        npsCategoryMatch = false;
      } else if (selectedNpsCategoryIds.length === npsCategories.length) {
        npsCategoryMatch = true;
      } else {
        npsCategoryMatch = selectedNpsCategoryIds.some((categoryId) => {
          const category = npsCategories.find((cat) => cat.id === categoryId);
          return category ? scoreIsInNpsCategory(nps, category) : false;
        });
      }

      // Response Range Filter
      const responsesMeetCriteria =
        responses >= minResponses && responses <= maxResponses;

      return npsCategoryMatch && responsesMeetCriteria;
    });
  }, [npsStats.regions, selectedNpsCategoryIds, minResponses, maxResponses]);

  const filteredStats = useMemo(() => {
    return {
      cityCount: filteredCityData.length,
      regionCount: filteredRegionData.length,
      totalResponses: filteredCityData.reduce(
        (sum, city) => sum + city.total_responses,
        0
      ),
      avgNps:
        filteredCityData.length > 0
          ? filteredCityData.reduce(
              (sum, city) => sum + (city.avg_nps || 0) * city.total_responses,
              0
            ) /
            Math.max(
              1,
              filteredCityData.reduce(
                (sum, city) => sum + city.total_responses,
                0
              )
            )
          : null,
    };
  }, [filteredCityData, filteredRegionData]);

  const handleViewModeChange = useCallback((event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  }, []);

  // Removed handleNpsRangeChange

  const handleMinResponsesChange = useCallback((event) => {
    const value = Number.parseInt(event.target.value, 10);
    setMinResponses(isNaN(value) || value < 0 ? 0 : value);
  }, []);

  const handleMaxResponsesChange = useCallback((event) => {
    const valueString = event.target.value;
    if (valueString === "") {
      setMaxResponses(Infinity); // Set to Infinity if input is empty
    } else {
      const value = Number.parseInt(valueString, 10);
      setMaxResponses(isNaN(value) || value < 0 ? 0 : value);
    }
  }, []);

  const handleNpsCategoryChange = useCallback((categoryId) => {
    setSelectedNpsCategoryIds((prevSelectedIds) => {
      const newSelectedIds = prevSelectedIds.includes(categoryId)
        ? prevSelectedIds.filter((id) => id !== categoryId)
        : [...prevSelectedIds, categoryId];
      return newSelectedIds;
    });
  }, []);

  const handleExport = () => {
    // Exemple : export des villes filtrées avec NPS et réponses
    const rows = filteredCityData.map((city) => ({
      City: city.name,
      "Average NPS": city.avg_nps,
      "Total Responses": city.total_responses,
      Promoters: city.promoters,
      Detractors: city.detractors,
      Passives: city.passives,
    }));
    exportToExcel({
      rows,
      sheetName: "MapCities",
      fileName: "map_cities_data.xlsx",
    });
  };
  const handleExcelExport = () => handleExport();
  const handlePdfExport = () => {
    const rows = filteredCityData.map((city) => ({
      City: city.name,
      "Average NPS": city.avg_nps,
      "Total Responses": city.total_responses,
      Promoters: city.promoters,
      Detractors: city.detractors,
      Passives: city.passives,
    }));
    exportChartDataToPdf({
      rows,
      title: "Map Cities Data",
      fileName: "map_cities_data.pdf",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%", // Adjusted to fill the padded main area
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress sx={{ color: themeColors.primary[500] }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          m: 3, // Ensure this margin doesn't conflict with Topbar area
          fontSize: "1rem",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          "& .MuiAlert-icon": {
            fontSize: "2rem",
          },
        }}
      >
        Failed to load map data: {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 84px)", // Adjust based on your navbar/header height
        p: 1.5,
        backgroundColor: theme.palette.background.default,
        gap: 1.5,
        overflow: "auto", // Changed from 'hidden' to 'auto'
        boxSizing: "border-box", // Ensure padding doesn't add to total height
      }}
    >
      <Paper
        sx={{
          p: 1.5,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
          alignItems: "center", // Ajouté pour aligner verticalement
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            minHeight: "36px",
            color: theme.palette.text.primary,
          }}
        >
          Showing:{" "}
          <Chip
            label={`${filteredStats.cityCount} Cities`}
            size="small"
            sx={{
              ml: 1,
              backgroundColor: themeColors.primary[500],
              color: "white",
              fontSize: "0.85rem",
              height: "28px",
            }}
          />
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            minHeight: "36px",
            color: theme.palette.text.primary,
          }}
        >
          Total Responses:{" "}
          <Chip
            label={filteredStats.totalResponses.toLocaleString()}
            size="small"
            sx={{
              ml: 1,
              backgroundColor: themeColors.blueAccent[500],
              color: "white",
              fontSize: "0.85rem",
              height: "28px",
            }}
          />
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              minHeight: "36px",
              color: theme.palette.text.primary,
            }}
          >
            Average NPS:{" "}
            <Chip
              label={
                filteredStats.avgNps !== null
                  ? filteredStats.avgNps.toFixed(1)
                  : "N/A"
              }
              size="small"
              sx={{
                ml: 1,
                backgroundColor: getNpsColor(filteredStats.avgNps, themeColors),
                color: "white",
                fontSize: "0.85rem",
                fontWeight: "bold",
                height: "28px",
              }}
            />
          </Typography>
          <Box sx={{ ml: 2 }}>
            <ExportButton
              handleExcelExport={handleExcelExport}
              handlePdfExport={handlePdfExport}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          gap: 1.5, // Reduced gap
          overflow: "hidden",
          flexDirection: { xs: "column", lg: "row" }, // Responsive direction
        }}
      >
        <Box
          ref={mapContainerRef} // Add this ref to the container Box
          sx={{
            flexGrow: 1,
            height: { xs: "calc(55vh - 32px - 12px)", lg: "100%" }, // Adjusted for responsiveness
            width: { xs: "100%", lg: "auto" },
            borderRadius: "4px",
            overflow: "hidden",
            border: `1px solid ${themeColors.grey[300]}`,
            boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
            backgroundColor: "white",
          }}
        >
          {viewMode === "cities" ? (
            <CityBubbleMap
              cityData={filteredCityData}
              mapCenter={mapDefaultCenter}
              mapZoom={mapDefaultZoom}
              themeColors={themeColors}
              theme={theme}
              mapRef={mapRef} // Pass the map ref
              mapContainerRef={mapContainerRef} // Pass the container ref
            />
          ) : (
            <RegionStatsList
              regionData={filteredRegionData}
              themeColors={themeColors}
              theme={theme}
            />
          )}
        </Box>

        <Box
          sx={{
            width: { xs: "100%", lg: "290px" }, // Reduced width and responsive
            display: "flex",
            flexDirection: "column",
            gap: 1.5, // Reduced gap
            p: 0,
            overflowY: "auto",
            height: { xs: "auto", lg: "100%" }, // Adjusted for responsiveness
            maxHeight: { xs: "calc(45vh - 32px - 12px)", lg: "none" }, // Max height on small screens
          }}
        >
          <MapControlsPanel
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            // npsRange and onNpsRangeChange removed
            minResponses={minResponses}
            onMinResponsesChange={handleMinResponsesChange}
            maxResponses={maxResponses} // Pass new state and handler
            onMaxResponsesChange={handleMaxResponsesChange} // Pass new state and handler
            themeColors={themeColors}
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onClearSearch={handleClearSearch}
            citySuggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          <MapLegendDisplay
            themeColors={themeColors}
            selectedNpsCategoryIds={selectedNpsCategoryIds} // Pass new state and handler
            onNpsCategoryChange={handleNpsCategoryChange} // Pass new state and handler
          />
          <AnalysisInsights
            cityData={filteredCityData} // Will use already filtered data
            regionData={filteredRegionData} // Will use already filtered data
            themeColors={themeColors}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Map;
