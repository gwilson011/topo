import axios from "axios";
import { areaUnderCurve } from "./Calculate";
const google = window.google;
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
        console.log(response);
        const dist = response.data.routes[0].legs[0].distance.text;
        const encodedPath = response.data.routes[0].overview_polyline.points;
        if (dist.match(/ft/g)) {
          const returnObj = {
            distance: parseFloat(dist.match(/[0-9]+/g)[0] / 5280),
            path: decodePath(encodedPath),
            steps: response.data.routes[0].legs[0].steps,
            end: response.data.routes[0].legs[0].end_location,
          };
          resolve(returnObj);
        } else {
          const returnObj = {
            distance: parseFloat(dist.match(/(\d+\.\d+)/g)[0]),
            path: decodePath(encodedPath),
            steps: response.data.routes[0].legs[0].steps,
            end: response.data.routes[0].legs[0].end_location,
          };
          console.log(returnObj);
          resolve(returnObj);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

function decodePath(path) {
  return google.maps.geometry.encoding.decodePath(path);
}

export function getDirectDistance(source, destination) {
  console.log(typeof source.lat);
  console.log(destination.lat, destination.lng);
  // Draw a line showing the straight distance between the markers
  //var line = new google.maps.Polyline({path: [dakota, frick], map: map});

  // if (source.lon !== undefined) {
  //   console.log("lat");
  //   return google.maps.geometry.spherical.computeDistanceBetween(
  //     new google.maps.LatLng(34.0450578, -118.5282948),
  //     new google.maps.LatLng(34.0449125, -118.5283322)
  //   );
  // } else if (source.lng !== undefined) {
  //   console.log("lng");
  //   return google.maps.geometry.spherical.computeDistanceBetween(
  //     new google.maps.LatLng(34.0450578, -118.5282948),
  //     new google.maps.LatLng(34.0449125, -118.5283322)
  //   );
  // }
}

export const getElevationBetween = (first, second) => {
  console.log("fetching elevation...");
  console.log(first, second);
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
        console.log(response.data);
        const elevationPoints = [];
        for (let i in response.data.results) {
          elevationPoints.push(response.data.results[i].elevation);
        }
        //console.log(elevationPoints);
        resolve(areaUnderCurve(elevationPoints));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};
