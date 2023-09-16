import axios from "axios";
//const querystring = require("querystring-es3");

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(loc);
        },
        () => {
          reject(new Error("Failed to retrieve location"));
        }
      );
    } else {
      // Browser doesn't support Geolocation
      reject(new Error("Geolocation is not supported"));
    }
  });
};

export const getDistanceBetween = (first, second) => {
  console.log("fetching distance...");
  console.log("key", process.env.REACT_APP_GOOGLE_API_KEY);
  const origin = first.lat + "," + first.lng;
  const destination = second.lat + "," + second.lng;
  const baseUrl = "http://localhost:8080/directions";
  const params = {
    origin: origin,
    destination: destination,
    key: process.env.REACT_APP_GOOGLE_API_KEY,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl, { params })
      .then((response) => {
        console.log(process.env.GOOGLE_API_KEY);
        console.log(response.data);
        const dist = response.data.routes[0].legs[0].distance.text;
        if (dist.match(/ft/g)) {
          resolve(parseFloat(dist.match(/[0-9]+/g)[0] / 5280));
        } else {
          resolve(parseFloat(dist.match(/(\d+\.\d+)/g)[0]));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

export const getElevationBetween = (first, second) => {
  console.log("fetching elevation...");
  const origin = first.lat + "," + first.lng;
  const destination = second.lat + "," + second.lng;
  const baseUrl = "http://localhost:8080/elevations";
  const params = {
    path: origin + "|" + destination,
    samples: 3,
    key: process.env.REACT_APP_GOOGLE_API_KEY,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl, { params })
      .then((response) => {
        //const distance = response.data.routes[0].legs[0].distance.text;
        //console.log(`Distance: ${distance}`);
        const elevationPoints = [];
        for (let i in response.data.results) {
          //console.log(response.data.results[i].elevation);
          elevationPoints.push(response.data.results[i].elevation);
        }
        //console.log(elevationPoints);
        resolve(elevationPoints);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};
