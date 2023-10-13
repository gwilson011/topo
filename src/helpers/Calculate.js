import { getDirectDistance } from "./Google";

export function getArea(currentLoc, inputMileage) {
  console.log(currentLoc);
  let degPerMileLat = 1 / 69;
  let degPerMileLng = 1 / 54.6;
  let square;

  return (square = {
    upperLat: currentLoc.lat + degPerMileLat * inputMileage,
    lowerLat: currentLoc.lat - degPerMileLat * inputMileage,
    upperLong: currentLoc.lng + degPerMileLng * inputMileage,
    lowerLong: currentLoc.lng - degPerMileLng * inputMileage,
  });
}

export function toMeters(miles) {
  //easy
  return miles / 0.000621371;
}

export function areaUnderCurve(points) {
  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    //using the trapizodal method
    area = area + 0.5 * (points[i] + points[i + 1]);
  }
  return area;
}

export const simplify = async (nodeList) => {
  console.log("simplifying...");
  const clusters = [];
  const nodeListCopy = nodeList.slice();
  //identify nodes that are close together
  for (let i in nodeListCopy) {
    const clusterList = [];
    const node = nodeListCopy.pop();
    if (node === undefined) continue;
    clusterList.push(node);
    //console.log("checking .... ", node.id);
    //console.log(nodeListCopy.length);
    for (let x in nodeListCopy) {
      if (node === nodeListCopy[x] || nodeListCopy[x] === undefined) continue;
      console.log(node, nodeListCopy[x]);
      let distance = getDirectDistance(node, nodeListCopy[x]);
      //console.log(distance);
      if (parseFloat(distance) < 50) {
        console.log("close");
        clusterList.push(nodeListCopy[x]);
        nodeListCopy[x] = undefined;
      }
    }
    if (clusterList.length > 1) clusters.push(clusterList);
  }
  //remove redundant nodes
  let originalLength = nodeList.length;
  for (let i in clusters) {
    //exclude the first node, remove the rest
    for (let x = 1; x <= clusters[i].length - 1; x++) {
      //console.log(clusters[i][x]);
      //console.log(nodeList.indexOf(clusters[i][x]));
      nodeList.splice(nodeList.indexOf(clusters[i][x]), 1);
    }
  }
  console.log("removed ", originalLength - nodeList.length, " redundant nodes");
  return nodeList;
};

export function commonElementsWithOrder(arr1, arr2) {
  // Create a Set from arr2 for efficient lookups
  const setArr2 = new Set(arr2);

  // Initialize an empty result array to store common elements
  const result = [];

  // Iterate through arr1, checking if each element exists in arr2
  for (const item of arr1) {
    if (setArr2.has(item)) {
      result.push(item);
    }
  }

  return result;
}

export function reverseMap(originalMap) {
  const reversedMap = new Map();

  for (const [key, value] of originalMap.entries()) {
    const stringValue = value.lat.toString() + value.lng.toString();
    reversedMap.set(stringValue, key);
  }
  console.log("map reversed");
  return reversedMap;
}

export function calculateDistance(mk1, mk2) {
  var R = 6371000; // Radius of the Earth in miles
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
