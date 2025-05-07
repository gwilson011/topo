import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import DistanceBasedRoutes from "./Distance";

export const Map = ({ setLoading, setRouteInfo, ...props }) => {
    const [directionsData, setDirectionsData] = useState(null);
    const [elevation, setElevation] = useState();
    const directionsRendererRef = useRef(null);
    const mapRef = useRef(null);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const center = {
        lat: props.start[0],
        lng: props.start[1],
    };

    // Clears the previous directions from the map
    const clearDirections = () => {
        if (directionsRendererRef.current) {
            directionsRendererRef.current.setMap(null);
            directionsRendererRef.current = null;
        }
    };

    useEffect(() => {
        clearDirections(); // Clear old polyline on new input
        setDirectionsData(null);
    }, [props.start, props.maxDistance]);

    useEffect(() => {
        if (directionsData && mapRef.current) {
            const renderer = new window.google.maps.DirectionsRenderer();
            renderer.setDirections(directionsData);
            renderer.setMap(mapRef.current);
            directionsRendererRef.current = renderer;

            const leg = directionsData.routes[0].legs[0];
            setRouteInfo({
                distance: leg.distance.text,
                elevation: elevation,
            });
        }
    }, [directionsData, elevation, setRouteInfo]);

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100vh" }}
                center={center}
                zoom={13}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {props.maxDistance && (
                    <DistanceBasedRoutes
                        center={center}
                        maxDistanceMiles={props.maxDistance}
                        setDirections={setDirectionsData}
                        setLoading={setLoading}
                        setElevation={setElevation}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
