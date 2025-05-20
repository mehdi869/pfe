import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// L is not strictly needed if not using L.icon, but good to have for Leaflet type consistency if extended
// import L from 'leaflet';

import { fetchGeoNpsStats } from '../../API/api';
import cityLocationsRawData from '../Map/Data.json'; // Source of city lat/lon

// MUI components for a polished UI
import {
  Box,
  Typography,
  Switch,
  Slider,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { tokens } from "../../styles/theme"; // Your theme tokens

// --- Helper Functions ---

// Determines bubble color based on NPS score
const getNpsColor = (nps, themeColors) => {
  if (nps === null || nps === undefined) return themeColors.grey[500]; // Neutral for no data
  if (nps >= 75) return themeColors.greenAccent[500];
  if (nps >= 50) return themeColors.greenAccent[400];
  if (nps >= 25) return themeColors.blueAccent[300];
  if (nps >= 0) return themeColors.blueAccent[200];
  if (nps >= -25) return themeColors.redAccent[200];
  if (nps >= -50) return themeColors.redAccent[300];
  if (nps >= -75) return themeColors.redAccent[400];
  return themeColors.redAccent[500];
};

// Determines bubble radius based on response count
const getBubbleRadius = (responseCount) => {
  if (!responseCount || responseCount <= 0) return 4; // Min radius for visibility
  const minRadius = 5;
  const maxRadius = 35; // Max visual radius
  // Using a logarithmic scale can help manage wide variations in response counts
  // Adjust base and multiplier as needed for your data distribution
  let radius = minRadius + Math.log(responseCount + 1) * 2.5;
  return Math.max(minRadius, Math.min(maxRadius, radius));
};

// --- Sub-Components ---

const MapControlsPanel = React.memo(({
  viewMode,
  onViewModeChange,
  npsRange,
  onNpsRangeChange,
  minResponses,
  onMinResponsesChange,
  themeColors
}) => {
  return (
    <Paper sx={{ p: 2, overflowY: 'auto', height: '100%', backgroundColor: themeColors.primary[400], color: themeColors.grey[100] }}>
      <Typography variant="h6" gutterBottom sx={{ color: themeColors.grey[100], borderBottom: `1px solid ${themeColors.grey[700]}`, pb: 1, mb:2 }}>
        Map Controls
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom variant="subtitle1" sx={{ color: themeColors.grey[200] }}>View Mode</Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={onViewModeChange}
          aria-label="View mode"
          fullWidth
          size="small"
        >
          <ToggleButton value="cities" aria-label="Cities view" sx={{ color: themeColors.grey[100], '&.Mui-selected': { backgroundColor: themeColors.blueAccent[700], color: themeColors.grey[100] } }}>Cities</ToggleButton>
          <ToggleButton value="regions" aria-label="Regions view" sx={{ color: themeColors.grey[100], '&.Mui-selected': { backgroundColor: themeColors.blueAccent[700], color: themeColors.grey[100] } }}>Regions</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ my: 2, borderColor: themeColors.grey[700] }} />

      <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.grey[200] }}>Filters</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography component="div" gutterBottom id="nps-range-slider-label" sx={{ color: themeColors.grey[300] }}>NPS Score Range: <Chip label={`${npsRange[0]} to ${npsRange[1]}`} size="small" sx={{backgroundColor: themeColors.blueAccent[600], color: themeColors.grey[100]}} /></Typography>
        <Slider
          value={npsRange}
          onChange={onNpsRangeChange}
          valueLabelDisplay="auto"
          getAriaLabel={() => 'NPS Score Range'}
          aria-labelledby="nps-range-slider-label"
          min={-100}
          max={100}
          sx={{ color: themeColors.greenAccent[500] }}
          marks={[{ value: -100, label: '-100' }, { value: 0, label: '0' }, { value: 100, label: '100' }]}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom sx={{ color: themeColors.grey[300] }}>Minimum Responses</Typography>
        <TextField
          type="number"
          value={minResponses}
          onChange={onMinResponsesChange}
          fullWidth
          size="small"
          placeholder="e.g., 10"
          InputProps={{ sx: { color: themeColors.grey[100] }, inputProps: { min: 0 } }}
          InputLabelProps={{ sx: { color: themeColors.grey[300] } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: themeColors.grey[600] },
              '&:hover fieldset': { borderColor: themeColors.greenAccent[400] },
              '&.Mui-focused fieldset': { borderColor: themeColors.greenAccent[500] },
            }
          }}
        />
      </Box>
    </Paper>
  );
});

const MapLegendDisplay = React.memo(({ themeColors }) => {
  const npsGrades = [
    { score: 80, label: 'Excellent (≥ 75)', color: getNpsColor(80, themeColors) },
    { score: 60, label: 'Good (50-74)', color: getNpsColor(60, themeColors) },
    { score: 30, label: 'Fair (25-49)', color: getNpsColor(30, themeColors) },
    { score: 10, label: 'Okay (0-24)', color: getNpsColor(10, themeColors) },
    { score: -10, label: 'Needs Improvement (-25 to -1)', color: getNpsColor(-10, themeColors) },
    { score: -60, label: 'Poor (-50 to -26)', color: getNpsColor(-60, themeColors) },
    { score: -80, label: 'Very Poor (≤ -51)', color: getNpsColor(-80, themeColors) },
    { score: null, label: 'No Data', color: getNpsColor(null, themeColors) },
  ];

  const responseExamples = [
    { count: 10, label: 'Few (~10)' },
    { count: 100, label: 'Medium (~100)' },
    { count: 1000, label: 'Many (~1k+)' },
  ];

  return (
    <Paper elevation={0} sx={{ mt: 2, p: 2, backgroundColor: themeColors.primary[400], color: themeColors.grey[100] }}>
      <Typography variant="h6" gutterBottom sx={{ color: themeColors.grey[100], borderBottom: `1px solid ${themeColors.grey[700]}`, pb: 1, mb:2 }}>
        Legend
      </Typography>
      <Typography variant="subtitle2" sx={{ color: themeColors.grey[200], mb:1 }}>NPS Score Color</Typography>
      {npsGrades.map(grade => (
        <Box key={grade.label} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: 18, height: 18, backgroundColor: grade.color, mr: 1, borderRadius: '2px', border: `1px solid ${themeColors.grey[600]}` }} />
          <Typography variant="body2" sx={{ color: themeColors.grey[300] }}>{grade.label}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2, borderColor: themeColors.grey[700] }} />
      <Typography variant="subtitle2" sx={{ color: themeColors.grey[200], mb:1 }}>Response Count (Bubble Size)</Typography>
      {responseExamples.map(ex => (
        <Box key={ex.label} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{
            width: getBubbleRadius(ex.count) * 2,
            height: getBubbleRadius(ex.count) * 2,
            backgroundColor: themeColors.grey[500],
            borderRadius: '50%',
            mr: 1,
            border: `1px solid ${themeColors.grey[600]}`
          }} />
          <Typography variant="body2" sx={{ color: themeColors.grey[300] }}>{ex.label}</Typography>
        </Box>
      ))}
    </Paper>
  );
});

const CityBubbleMap = React.memo(({ cityData, mapCenter, mapZoom, themeColors, theme }) => {
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%', borderRadius: '4px', backgroundColor: themeColors.primary[500] }}
      scrollWheelZoom={true} // Enabled for better interaction
      maxBounds={[[18, -9], [38, 12]]} // Algeria bounds
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cityData.map(city => (
        <CircleMarker
          key={city.name}
          center={[city.latitude, city.longitude]}
          radius={getBubbleRadius(city.total_responses)}
          pathOptions={{
            fillColor: getNpsColor(city.avg_nps, themeColors),
            color: getNpsColor(city.avg_nps, themeColors), // Border color
            weight: 1,
            fillOpacity: 0.65,
          }}
        >
          <Tooltip direction="top" offset={[0, -getBubbleRadius(city.total_responses)]} opacity={1} permanent={false}>
            <Box sx={{p:0.5}}>
                <Typography variant="subtitle2" component="div" sx={{fontWeight: 'bold'}}>{city.name}</Typography>
                <Divider sx={{my:0.5}}/>
                <Typography variant="body2">Avg. NPS: <Chip label={city.avg_nps !== null ? city.avg_nps.toFixed(1) : 'N/A'} size="small" sx={{backgroundColor: getNpsColor(city.avg_nps, themeColors), color: theme.palette.getContrastText(getNpsColor(city.avg_nps, themeColors))}}/> </Typography>
                <Typography variant="body2">Responses: {city.total_responses.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{fontSize: '0.75rem'}}>P: {city.promoters}, Pa: {city.passives}, D: {city.detractors}</Typography>
            </Box>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
});

const RegionStatsList = React.memo(({ regionData, themeColors }) => {
    if (!regionData || regionData.length === 0) {
        return <Typography sx={{p:2, color: themeColors.grey[300]}}>No regional data available or matches filters.</Typography>;
    }
    return (
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto', backgroundColor: themeColors.primary[400] }}>
        <Typography variant="h5" gutterBottom sx={{ color: themeColors.grey[100], borderBottom: `1px solid ${themeColors.grey[700]}`, pb: 1, mb:2 }}>
            Regional NPS Statistics
        </Typography>
        <Grid container spacing={2}>
            {regionData.map(region => (
            <Grid item xs={12} sm={6} md={4} key={region.name}>
                <Paper sx={{ p: 2, backgroundColor: themeColors.primary[500], color: themeColors.grey[200], borderLeft: `5px solid ${getNpsColor(region.avg_nps, themeColors)}` }}>
                <Typography variant="h6" sx={{ color: themeColors.grey[100] }}>{region.name}</Typography>
                <Divider sx={{my:1, borderColor: themeColors.grey[700]}}/>
                <Typography variant="body1">Avg. NPS: <Chip label={region.avg_nps !== null ? region.avg_nps.toFixed(1) : 'N/A'} size="small" sx={{backgroundColor: getNpsColor(region.avg_nps, themeColors), color: theme.palette.getContrastText(getNpsColor(region.avg_nps, themeColors))}}/></Typography>
                <Typography variant="body2">Responses: {region.total_responses.toLocaleString()}</Typography>
                <Typography variant="caption" display="block">Promoters: {region.promoters.toLocaleString()}</Typography>
                <Typography variant="caption" display="block">Passives: {region.passives.toLocaleString()}</Typography>
                <Typography variant="caption" display="block">Detractors: {region.detractors.toLocaleString()}</Typography>
                </Paper>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
});


// --- Main Page Component ---
const Map = () => {
  const theme = useTheme();
  const themeColors = tokens(theme.palette.mode);

  const [npsStats, setNpsStats] = useState({ cities: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapDefaultCenter] = useState([28.0339, 1.6596]); // Algeria center
  const [mapDefaultZoom] = useState(5);

  // Filters & View Mode
  const [viewMode, setViewMode] = useState('cities'); // 'cities' or 'regions'
  const [npsRange, setNpsRange] = useState([-100, 100]);
  const [minResponses, setMinResponses] = useState(0);

  const isValidGeoNpsApiData = useCallback((data) => {
    return (
      data &&
      typeof data === "object" &&
      Array.isArray(data.cities) &&
      Array.isArray(data.regions)
    );
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const cacheKey = "geoNpsMapApiData";

      try {
        let apiDataToUse;
        const cachedDataString = localStorage.getItem(cacheKey);
        if (cachedDataString) {
          const parsed = JSON.parse(cachedDataString);
          if (isValidGeoNpsApiData(parsed)) {
            apiDataToUse = parsed;
          } else {
            localStorage.removeItem(cacheKey); // Remove invalid cache
          }
        }

        if (!apiDataToUse) {
          const fetchedData = await fetchGeoNpsStats();
          if (isValidGeoNpsApiData(fetchedData)) {
            apiDataToUse = fetchedData;
            localStorage.setItem(cacheKey, JSON.stringify(apiDataToUse));
          } else {
            throw new Error("Fetched GeoNPS data structure is invalid.");
          }
        }
        setNpsStats(apiDataToUse);
      } catch (err) {
        console.error("Error loading NPS geo stats:", err);
        setError(err.message || "An unknown error occurred while fetching map data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isValidGeoNpsApiData]);

  const mergedCityData = useMemo(() => {
    if (!npsStats.cities.length || !cityLocationsRawData.length) return [];
    return cityLocationsRawData
      .map(location => {
        const lat = parseFloat(location.Latitude);
        const lon = parseFloat(location.Longitude);

        if (isNaN(lat) || isNaN(lon) || !location.ville) {
          // console.warn("Skipping invalid location entry:", location);
          return null;
        }
        const cityStat = npsStats.cities.find(s => s.name === location.ville);
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
      .filter(item => item !== null);
  }, [npsStats.cities]);


  const filteredCityData = useMemo(() => {
    return mergedCityData.filter(city => {
      const nps = city.avg_nps;
      const responses = city.total_responses;
      const npsIsInRange = nps === null || (nps >= npsRange[0] && nps <= npsRange[1]);
      const responsesMeetCriteria = responses >= minResponses;
      return npsIsInRange && responsesMeetCriteria;
    });
  }, [mergedCityData, npsRange, minResponses]);

  // Filtered region data (example: if you want to filter regions too, though less common for this view)
  const filteredRegionData = useMemo(() => {
    return npsStats.regions.filter(region => {
        const nps = region.avg_nps;
        const responses = region.total_responses;
        const npsIsInRange = nps === null || (nps >= npsRange[0] && nps <= npsRange[1]);
        const responsesMeetCriteria = responses >= minResponses;
        return npsIsInRange && responsesMeetCriteria;
    });
  }, [npsStats.regions, npsRange, minResponses]);


  const handleViewModeChange = useCallback((event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  }, []);

  const handleNpsRangeChange = useCallback((event, newValue) => {
    setNpsRange(newValue);
  }, []);

  const handleMinResponsesChange = useCallback((event) => {
    const value = parseInt(event.target.value, 10);
    setMinResponses(isNaN(value) || value < 0 ? 0 : value);
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', backgroundColor: themeColors.primary[500] }}><CircularProgress sx={{color: themeColors.greenAccent[500]}} size={50} /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{m:2}}>Failed to load map data: {error}</Alert>;
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', p: 1, gap: 1, backgroundColor: themeColors.primary[500] }}> {/* Adjust height based on your AppBar */}
      <Box sx={{ width: '300px', flexShrink: 0 }}> {/* Controls Panel Width */}
        <MapControlsPanel
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          npsRange={npsRange}
          onNpsRangeChange={handleNpsRangeChange}
          minResponses={minResponses}
          onMinResponsesChange={handleMinResponsesChange}
          themeColors={themeColors}
        />
        <MapLegendDisplay themeColors={themeColors} />
      </Box>

      <Box sx={{ flexGrow: 1, height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
        {viewMode === 'cities' ? (
          <CityBubbleMap
            cityData={filteredCityData}
            mapCenter={mapDefaultCenter}
            mapZoom={mapDefaultZoom}
            themeColors={themeColors}
            theme={theme}
          />
        ) : (
          <RegionStatsList regionData={filteredRegionData} themeColors={themeColors} />
        )}
      </Box>
    </Box>
  );
};

export default Map;