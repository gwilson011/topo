import { queryWays } from "./OSM";
import { WeightedGraph } from "./Dijkstra";
import { toMeters, reverseMap, calculateDistance } from "./Calculate";
import {
  getElevations,
  getRoutes,
  getDirectDistance,
  getElevationBetween,
} from "./Google";

export const linkCoordinates = async (cl, input, masterMap) => {
  if (input == 0 || input == undefined) return;
  const graph = new WeightedGraph(input);
  const rad = toMeters(input);
  const ways = await queryWays(cl, rad);
  const reversedMap = reverseMap(masterMap);

  console.log("populating coordinates...");
  //populate the coordinates
  const coordinateList = [];
  const nodeList = [];
  for (let i in ways) {
    coordinateList.push(ways[i].geometry);
    nodeList.push(ways[i].nodes);
  }
  console.log(coordinateList);
  console.log(nodeList);

  console.log("adding vertices to map...");
  //add vertices to map
  for (let i = 0; i < coordinateList.length; i++) {
    for (let t = 0; t < coordinateList[i].length - 1; t++) {
      const id = nodeList[i][t];
      graph.addVertex(id);
      masterMap.set(id, {
        lat: coordinateList[i][t].lat,
        lng: coordinateList[i][t].lon,
      });
    }
  }

  console.log("connecting vertices...");
  //connect vertices according to queried ways
  for (let i = 0; i < coordinateList.length; i++) {
    for (let t = 1; t < coordinateList[i].length - 1; t++) {
      const id1 = nodeList[i][t];
      const id2 = nodeList[i][t - 1];
      //get pure distance between coordinates
      const distance = calculateDistance(
        masterMap.get(id1),
        masterMap.get(id2)
      );
      //add edge to graph
      graph.addEdge(id1, id2, 0, distance);
    }
  }

  console.log(graph);
  console.log(masterMap);

  //add elevations; handle with batch calls
  const edgeList = graph.getEdges();
  const batchPromises = [];
  for (let i in edgeList) {
    const batch = edgeList[i];
    const origin = masterMap.get(parseInt(i));
    const batchPromise = Promise.all(
      batch.map(async (task) => {
        const dest = masterMap.get(task.node);
        console.log(origin, dest);
        const elevation = await getElevationBetween(origin, dest);
        graph.setEdgeWeight(i, task.node, elevation);
        return elevation;
      })
    );
    batchPromises.push(batchPromise);
  }
  console.log(batchPromises);

  try {
    const batchResults = await Promise.all(batchPromises);
    const flattenedResults = [].concat(...batchResults);
    console.log("flatten: ", flattenedResults);
  } catch (error) {
    console.error("Error processing batches:", error);
  }

  //create array of origin/destination objects to send
  // const routes = [];

  //iterate through 2D array; check to see if its already in the array
  // console.log("building route...");
  // for (let edgeNode in edgeList) {
  //   const originCoords = masterMap.get(parseInt(edgeNode));
  //   const originString = originCoords.lat + ", " + originCoords.lng;
  //   for (let x = 0; x < edgeList[edgeNode].length; x++) {
  //     const destCoords = masterMap.get(parseInt(edgeList[edgeNode][x].node));
  //     const destString = destCoords.lat + ", " + destCoords.lng;
  //     const coords = {
  //       origin: originString,
  //       destination: destString,
  //     };
  //     routes.push(coords);
  //   }
  // }

  // console.log(routes);
  // console.log("calculate elevations..");
  // //fetch distance and elevation data
  // const elevations = [];
  // for (let i in routes) {
  //   elevations.push(
  //     await getElevationBetween(routes[i].origin, routes[i].destination)
  //   );
  // }
  // console.log(elevations);

  //   const distanceData = await getRoutes(routes);
  //   const elevationData = await getElevations(routes);
  //parse data and add to edges
  //   for (let i = 0; i < distanceData.length; i++) {
  //     const coord1 = distanceData[i].route.origin.match(/-?\d+\.\d+/g);
  //     const value1 = (coord1[0] + coord1[1]).toString();
  //     const node1 = reversedMap.get(value1);

  //     const coord2 = distanceData[i].route.destination.match(/-?\d+\.\d+/g);
  //     const value2 = (coord2[0] + coord2[1]).toString();
  //     const node2 = reversedMap.get(value2);

  //     //add elevation and distance to edges
  //     //console.log(distanceData[i].distance, elevationData[i].areaUnderCurve);
  //     console.log(node1, node2);
  //     graph.setEdgeDistance(node1, node2, distanceData[i].distance);
  //     graph.setEdgeWeight(node1, node2, elevationData[i].areaUnderCurve);

  //     //clean up graph
  //     graph.cleanEdges();
  //   }

  console.log(graph);
  return graph;
};
