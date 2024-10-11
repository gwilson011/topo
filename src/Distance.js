import React, { useEffect, useState } from "react";

const DistanceBasedRoutes = ({
    center,
    maxDistanceMiles,
    apiKey,
    setDirections,
    setLoading,
    setElevation,
}) => {
    const NUMBER_OF_ROUTES = Math.floor(maxDistanceMiles * 8); // Number of routes to generate
    const milesToMeters = (miles) => miles * 1609.34;

    // Generate random lat/lng within a radius
    const generateRandomPoint = (lat, lng, radius) => {
        const radiusInDegrees = radius / 111320; // Convert radius from meters to degrees
        const t = 2 * Math.PI * Math.random(); // Random angle in radians
        const newLat = lat + radiusInDegrees * Math.cos(t); // Latitude at the radius distance
        const newLng =
            lng +
            (radiusInDegrees * Math.sin(t)) / Math.cos(lat * (Math.PI / 180)); // Longitude adjusted for curvature
        return { lat: newLat, lng: newLng };
    };

    const generateEquidistantPoints = (lat, lng, radius, numPoints) => {
        const radiusInDegrees = radius / 111320; // Convert radius from meters to degrees
        const points = [];

        // Loop to generate `numPoints` points around the circle
        for (let i = 0; i < numPoints; i++) {
            const t = (2 * Math.PI * i) / numPoints; // Equally spaced angles
            const newLat = lat + radiusInDegrees * Math.cos(t); // Latitude at the radius distance
            const newLng =
                lng +
                (radiusInDegrees * Math.sin(t)) /
                    Math.cos(lat * (Math.PI / 180)); // Adjust for longitude
            points.push({ lat: newLat, lng: newLng });
        }
        return points;
    };

    useEffect(() => {
        if (window.google) {
            const directionsService =
                new window.google.maps.DirectionsService();
            const elevationService = new window.google.maps.ElevationService();

            const calculateElevationGain = (path) => {
                return new Promise((resolve) => {
                    elevationService.getElevationAlongPath(
                        { path, samples: 256 },
                        (elevations, status) => {
                            if (
                                status === window.google.maps.ElevationStatus.OK
                            ) {
                                let totalElevationGain = 0;
                                for (let i = 1; i < elevations.length; i++) {
                                    const elevationChange =
                                        elevations[i].elevation -
                                        elevations[i - 1].elevation;
                                    if (elevationChange > 0) {
                                        totalElevationGain += elevationChange;
                                    }
                                }
                                resolve(totalElevationGain);
                            } else {
                                console.error("Elevation API error:", status);
                                resolve(Infinity); // Treat as invalid route
                            }
                        }
                    );
                });
            };

            const randomPoints = generateEquidistantPoints(
                center.lat,
                center.lng,
                milesToMeters(maxDistanceMiles),
                NUMBER_OF_ROUTES
            );
            // for (let i = 0; i < NUMBER_OF_ROUTES; i++) {
            //     randomPoints.push(
            //         generateRandomPoint(
            //             center.lat,
            //             center.lng,
            //             milesToMeters(maxDistanceMiles)
            //         )
            //     );
            // }

            const routes = [];
            let VALID_ROUTES = NUMBER_OF_ROUTES;
            randomPoints.forEach((randomPoint) => {
                directionsService.route(
                    {
                        origin: center,
                        destination: randomPoint,
                        travelMode: "WALKING", // Or DRIVING/BICYCLING
                    },
                    (result, status) => {
                        if (status === "OK") {
                            const route = result.routes[0];
                            calculateElevationGain(route.overview_path).then(
                                (elevationGain) => {
                                    routes.push({ route, elevationGain });
                                    console.log();
                                    console.log(routes.length, VALID_ROUTES);
                                    if (routes.length === VALID_ROUTES) {
                                        const bestRoute = routes.reduce(
                                            (prev, curr) =>
                                                curr.elevationGain <
                                                prev.elevationGain
                                                    ? curr
                                                    : prev
                                        );
                                        result.routes = [bestRoute.route];
                                        setDirections(result); // Pass directions to parent
                                        setElevation(bestRoute.elevationGain);
                                    }
                                }
                            );
                        } else {
                            VALID_ROUTES = VALID_ROUTES - 1;
                            console.error("Directions API error:", status);
                        }
                    }
                );
            });
        }
        setLoading(false);
    }, [maxDistanceMiles, setDirections]);

    return null; // This component does not render anything visually
};

export default DistanceBasedRoutes;
