import React, { useRef } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Tooltip,
    ZoomControl,
    useMap
} from "react-leaflet";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { getNpsColor, getBubbleRadius } from "../../utils/mapUtils";
import "leaflet/dist/leaflet.css";

// New sub-component so we can call useMap()
function CityMarker({ city, themeColors, mapContainerRef }) {
    const map = useMap();
    const radius = getBubbleRadius(city.total_responses);

    // Add null check for mapContainerRef
    let direction = "top";
    let offsetY = radius;

    if (mapContainerRef?.current) {
        // 1) marker pixel inside Leaflet container
        const { x, y } = map.latLngToContainerPoint([
            city.latitude,
            city.longitude
        ]);

        // 2) where that Leaflet container sits on the page
        const mapRect = map.getContainer().getBoundingClientRect();

        // 3) where *our* outer Box sits on the page
        const boxRect = mapContainerRef.current.getBoundingClientRect();

        // 4) compute marker Y *relative to the Box*
        const markerYinBox = y + mapRect.top - boxRect.top;

        // 5) flip based on half the Box's height
        direction = markerYinBox > boxRect.height / 2 ? "top" : "bottom";
        offsetY = direction === "bottom" ? -radius : radius;
    }

    return (
        <CircleMarker
            center={[city.latitude, city.longitude]}
            radius={radius}
            pathOptions={{
                fillColor: getNpsColor(city.avg_nps, themeColors),
                color:     getNpsColor(city.avg_nps, themeColors),
                weight: 1,
                fillOpacity: 0.7,
            }}
        >
            <Tooltip
                direction={direction}
                offset={[0, offsetY]}
                className="nps-tooltip"
            >
                <Box sx={{ p: 1.5, minWidth: "180px" }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {city.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                        }}
                    >
                        <span>Avg. NPS:</span>
                        <Chip
                            label={
                                city.avg_nps !== null
                                    ? city.avg_nps.toFixed(1)
                                    : "N/A"
                            }
                            size="small"
                            sx={{
                                backgroundColor: getNpsColor(
                                    city.avg_nps,
                                    themeColors
                                ),
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    </Typography>
                    <Typography variant="body2" mb={0.5}>
                        Responses:{" "}
                        <strong>
                            {city.total_responses.toLocaleString()}
                        </strong>
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            pt: 1,
                            borderTop: `1px dashed ${themeColors.grey[300]}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: themeColors.greenAccent[500] }}
                        >
                            P: {city.promoters}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: themeColors.grey[600] }}
                        >
                            Pa: {city.passives}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: themeColors.redAccent[500] }}
                        >
                            D: {city.detractors}
                        </Typography>
                    </Box>
                </Box>
            </Tooltip>
        </CircleMarker>
    );
}

const CityBubbleMap = React.memo(
    ({ cityData, mapCenter, mapZoom, themeColors, theme, mapRef, mapContainerRef }) => (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            ref={mapRef} // Use mapRef for the MapContainer
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
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />

            {cityData.map((city) => (
                <CityMarker
                    key={city.name}
                    city={city}
                    themeColors={themeColors}
                    mapContainerRef={mapContainerRef} // Pass the container ref
                />
            ))}

            <div
                style={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    zIndex: 1000,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "10px",
                }}
            >
                ©{" "}
                <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap
                </a>{" "}
                contributors
            </div>
        </MapContainer>
    )
);

export default CityBubbleMap;