import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MapWithRoute = () => {
  const [response, setResponse] = useState(null);
  const directionsServiceOptions = {
    destination: "San Francisco, CA",
    origin: "Los Angeles, CA",
    travelMode: "DRIVING",
  };

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} zoom={1}>
        <DirectionsService
          options={directionsServiceOptions}
          callback={(result) => {
            if (result != null) {
              setResponse(result);
            }
          }}
        />
        {response && <DirectionsRenderer directions={response} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithRoute;
