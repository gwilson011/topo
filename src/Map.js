import React, { useState, useEffect } from "react";
import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
} from "@react-google-maps/api";
import DistanceBasedRoutes from "./Distance"; // Import the new component

export const Map = ({ setLoading, setRouteInfo, ...props }) => {
    const [directions, setDirections] = useState(null);
    const [map, setMap] = useState(null);
    const [elevation, setElevation] = useState();

    const apiKey = "AIzaSyCXOEWCCB7d0KssOJMSp4ilbb99Avk9r-I";

    const mapContainerStyle = {
        width: "50%",
        height: "100vh",
    };

    const center = {
        lat: props.start[0], // Example latitude (San Francisco)
        lng: props.start[1], // Example longitude
    };

    useEffect(() => {
        if (directions) {
            console.log(directions.routes[0].legs[0].distance.text);

            setRouteInfo({
                distance: directions.routes[0].legs[0].distance.text,
                elevation: elevation,
            });
        }
    }, [directions]);

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                onLoad={(mapInstance) => setMap(mapInstance)}
            >
                {/* Render the DistanceBasedRoutes component to generate routes */}
                {props.maxDistance && (
                    <DistanceBasedRoutes
                        center={center}
                        maxDistanceMiles={props.maxDistance}
                        apiKey={apiKey}
                        setDirections={setDirections}
                        setLoading={setLoading}
                        setElevation={setElevation}
                    />
                )}

                {/* Render the directions on the map */}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
