import { getNodesOnWayOf } from "./OSM";
import { WeightedGraph } from "./Dijkstra";
import { getDistanceBetween, getElevationBetween } from "./Google";
import { areaUnderCurve, commonElementsWithOrder } from "./Calculate";

let masterNodeList = new Map();
const google = window.google;
let startNodeID = 100000000;

export const retrievePath = async (cl, intersectionNodes, inputDistance) => {
  console.log("retrieving...");
  console.log(intersectionNodes);
  const nodeIDs = [];

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
  console.log(masterNodeList);
  const graph = buildRoadWay(cl, nodeIDs, inputDistance);
  return graph;
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

const buildRoadWay = async (start, nodeList, inputDistance) => {
  console.log(nodeList);
  //start with node
  //get the way it belongs on
  //see if node match from the main list of intersection
  //if yes, link together in order???????
  const graph = new WeightedGraph(inputDistance);

  //populate map with vertices
  for (let node in nodeList) {
    graph.addVertex(nodeList[node]);
  }

  //connect vertices based on map data
  for (let i in nodeList) {
    let node = nodeList[i];
    const nodesAlongTheWay = excise(await getNodesOnWayOf(node));
    console.log("all nodes on the way: ", nodesAlongTheWay);
    //get the list of nodes in relevant in order of way
    const commonElements = commonElementsWithOrder(nodesAlongTheWay, nodeList);
    //console.log("common elements: ", commonElements);
    console.log("relevant nodes on the way: ", commonElements);

    //link each of them together
    for (let x = 0; x <= commonElements.length - 2; x++) {
      //if there is only one element
      if (commonElements.length === 1) break;
      const vertex1 = commonElements[x];
      const vertex2 = commonElements[x + 1];
      //if the vertices are the same
      if (vertex1 === vertex2) break;

      //get coordinate information from master list
      const coord1 = masterNodeList.get(vertex1);
      const coord2 = masterNodeList.get(vertex2);

      console.log("examining coords: ", coord1, coord2);

      //see if current location is between two coords
      const route = new google.maps.Polyline({
        path: [
          new google.maps.LatLng(coord1.lat, coord1.lng),
          new google.maps.LatLng(coord2.lat, coord2.lng),
        ],
      });

      //if it is insert in between the two objects
      if (google.maps.geometry.poly.isLocationOnEdge(start, route, 70e-5)) {
        console.log("ON EDGE");
        //get distance and elevation in between
        const distance1 = await getDistanceBetween(coord1, start);
        const elevationWeight1 = areaUnderCurve(
          await getElevationBetween(coord1, start)
        );
        const distance2 = await getDistanceBetween(start, coord2);
        const elevationWeight2 = areaUnderCurve(
          await getElevationBetween(start, coord2)
        );
        //add edges
        console.log("start is ", start);
        graph.addEdge(vertex1, startNodeID, elevationWeight1, distance1);
        graph.addEdge(startNodeID, vertex2, elevationWeight2, distance2);
      } else {
        //if not tho
        //get distance and elevation
        const distance = await getDistanceBetween(coord1, coord2);
        const elevationWeight = areaUnderCurve(
          await getElevationBetween(coord1, coord2)
        );

        //add the edge to the map
        graph.addEdge(vertex1, vertex2, elevationWeight, distance);
      }
    }
  }

  //work in progress
  graph.cleanEdges();
  console.log(graph);
  console.log(nodeList);
  return graph;
};
