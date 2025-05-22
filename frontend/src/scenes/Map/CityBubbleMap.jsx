import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { getNpsColor, getBubbleRadius } from "../../utils/mapUtils";
import "leaflet/dist/leaflet.css";

const CityBubbleMap = React.memo(({ cityData, mapCenter, mapZoom, themeColors, theme }) => {
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "4px",
        backgroundColor: "white",
      }}
      scrollWheelZoom={true}
      maxBounds={[
        [18, -9],
        [38, 12],
      ]}
      minZoom={mapZoom}
      maxZoom={12}
      zoomControl={false}
      attributionControl={false}
    >
      <ZoomControl position="topleft" />
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      {cityData.map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.latitude, city.longitude]}
          radius={getBubbleRadius(city.total_responses)}
          pathOptions={{
            fillColor: getNpsColor(city.avg_nps, themeColors),
            color: getNpsColor(city.avg_nps, themeColors),
            weight: 1,
            fillOpacity: 0.7,
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -getBubbleRadius(city.total_responses)]}
            opacity={1}
            permanent={false}
            className="nps-tooltip"
          >
            <Box sx={{ p: 1.5, minWidth: "180px" }}>
              <Typography
                variant="subtitle2"
                component="div"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mb: 0.5,
                }}
              >
                {city.name}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Avg. NPS:</span>
                <Chip
                  label={city.avg_nps !== null ? city.avg_nps.toFixed(1) : "N/A"}
                  size="medium"
                  sx={{
                    backgroundColor: getNpsColor(city.avg_nps, themeColors),
                    color: "white",
                    fontWeight: "bold",
                    ml: 1,
                  }}
                />
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontSize: "0.95rem",
                }}
              >
                Responses: <strong>{city.total_responses.toLocaleString()}</strong>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  pt: 1,
                  borderTop: `1px dashed ${themeColors.grey[300]}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: themeColors.greenAccent[500],
                  }}
                >
                  P: {city.promoters}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: themeColors.grey[600],
                  }}
                >
                  Pa: {city.passives}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: themeColors.redAccent[500],
                  }}
                >
                  D: {city.detractors}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </CircleMarker>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "5px",
          zIndex: 1000,
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: "2px 5px",
          borderRadius: "3px",
          fontSize: "10px",
        }}
      >
        © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ©{" "}
        <a href="https://carto.com/attributions">CARTO</a>
      </div>
    </MapContainer>
  );
});

export default CityBubbleMap;