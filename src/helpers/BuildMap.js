import { getNodesOnWayOf } from "./OSM";
import { WeightedGraph } from "./Dijkstra";
import { getDistanceBetween, getElevationBetween, getDistance } from "./Google";
import { areaUnderCurve, commonElementsWithOrder, toMeters } from "./Calculate";

//let masterNodeList;
const google = window.google;
let startNodeID = 100000000;

export const retrievePath = async (
  cl,
  intersectionNodes,
  inputDistance,
  masterNode
) => {
  console.log("retrieving...");
  console.log(intersectionNodes);
  const nodeIDs = [];
  const masterNodeList = masterNode;

  //clean intersection, eliminating nodes close together

  //add starting point
  nodeIDs.push(startNodeID);
  masterNodeList.set(startNodeID, {
    lat: cl.lat,
    lng: cl.lng,
  });

  //pull nodeIDS & populate masterlist
  for (let i in intersectionNodes) {
    //console.log(intersectionNodes[i]);
    nodeIDs.push(intersectionNodes[i].id);
    masterNodeList.set(intersectionNodes[i].id, {
      lat: intersectionNodes[i].lat,
      lng: intersectionNodes[i].lon,
    });
  }
  return new Promise((resolve, reject) => {
    //console.log(masterNodeList);
    const graph = buildRoadWay(cl, nodeIDs, inputDistance, masterNodeList);
    resolve(graph);
  });
};

function excise(elements) {
  //console.log(elements);
  let wayList = [];
  for (let i in elements) {
    if (elements[i].type === "way") {
      for (let node in elements[i].nodes) {
        wayList.push(elements[i].nodes[node]);
      }
    }
  }
  return wayList;
}

const buildRoadWay = async (start, nodeList, inputDistance, masterNodeList) => {
  console.log(nodeList);
  //start with node
  //if yes, link together in order???????
  const graph = new WeightedGraph(inputDistance);

  //populate map with vertices
  for (let node in nodeList) {
    graph.addVertex(nodeList[node]);
  }

  //connect vertices based on map data
  for (let i in nodeList) {
    let vertex1 = nodeList[i];
    const coord1 = masterNodeList.get(vertex1);

    //check distance and elevation
    for (let x = parseInt(i) + 1; x <= nodeList.length - 1; x++) {
      //get coordinate information from master list
      let vertex2 = nodeList[x];
      const coord2 = masterNodeList.get(vertex2);
      console.log("examining coords: ", coord1, coord2);
      console.log("examining vertices: ", vertex1, vertex2);

      //get path and distance between two points
      const { distance, path } = await getDistanceBetween(coord1, coord2);
      const comppath = [
        new google.maps.LatLng(coord1.lat, coord1.lng),
        new google.maps.LatLng(coord2.lat, coord2.lng),
      ];
      const route = new google.maps.Polyline({ path });
      console.log("ROUTE: ", route);
      //see if route is shortest possible
      let directRoute = true;
      for (let n = 0; n < nodeList.length - 1; n++) {
        if (nodeList[n] === vertex1 || nodeList[n] === vertex2) continue;
        if (
          google.maps.geometry.poly.isLocationOnEdge(
            masterNodeList.get(nodeList[n]),
            route,
            10e-6
          )
        ) {
          console.log(nodeList[n], " found in between");
          directRoute = false;
          break;
          if (nodeList[n] === 100000000) {
            console.log("test");
          }
        }
      }
      if (directRoute) {
        console.log("creating edge between ", vertex1, " and ", vertex2);
        console.log(
          "which is ",
          coord1.lat,
          coord1.lng,
          " and ",
          coord2.lat,
          coord2.lng
        );
        console.log(distance);
        const elevationWeight = areaUnderCurve(
          await getElevationBetween(coord1, coord2)
        );
        graph.addEdge(vertex1, vertex2, elevationWeight, distance);
      }
    }
  }

  //work in progress
  graph.cleanEdges();
  //console.log(graph);
  //console.log(nodeList);
  return graph;
};

export const breakDown = async (inputDistance, pathArray, masterNodeList) => {
  console.log(pathArray);
  const vertex2 = pathArray.pop();
  const vertex1 = pathArray.pop();
  console.log(parseInt(vertex1), vertex2);
  console.log(masterNodeList);
  const { distance, steps, end } = await getDistanceBetween(
    masterNodeList.get(parseInt(vertex1)),
    masterNodeList.get(vertex2)
  );
  return new Promise((resolve, reject) => {
    if (distance === parseFloat(inputDistance)) {
      resolve(end);
    }
    let totalDistance = 0;
    let coords;
    const max = toMeters(inputDistance);
    for (let i = 0; i < steps.length; i++) {
      console.log(totalDistance);
      if (totalDistance >= max - 80) {
        coords = steps[i].start_location;
        resolve(coords);
      } else {
        totalDistance = totalDistance + steps[i].distance.value;
      }
    }
    resolve(steps[steps.length - 1].start_location);
  });
};
