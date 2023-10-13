import React, { useState } from "react";
import "./helpers/Dijkstra";
import { WeightedGraph, testAlg } from "./helpers/Dijkstra";
import { toMeters, simplify } from "./helpers/Calculate";
import { retrievePath, breakDown } from "./helpers/BuildMap";
import { queryIntersections } from "./helpers/OSM";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import { linkCoordinates } from "./helpers/CreateMap";

//yes
const Geo = () => {
  const [distanceState, setDistanceState] = useState("");
  const [map, setMap] = useState(new WeightedGraph(null));
  const [nodeMap, setNodeMap] = useState(new Map());
  const [startLoc, setStartLoc] = useState();
  const [array, setArray] = useState(null);

  const onPress = async () => {
    let cl, intersectionData;
    // try {
    //   cl = await getCurrentLocation();
    // } catch (error) {
    //   console.error(error.message);
    // }
    cl = { lat: 34.048014, lng: -118.526918 };

    let graph;
    try {
      graph = await linkCoordinates(cl, distanceState, nodeMap);
      console.log(graph);
    } catch (error) {
      console.error(error.message);
    }
    // let masterNodeMap = new Map();
    // try {
    //   graph = await retrievePath(
    //     cl,
    //     nodeList,
    //     parseFloat(distanceState),
    //     masterNodeMap
    //   );
    // } catch (error) {
    //   console.error(error.message);
    // }

    console.log("results: ", graph);
    setMap(graph);
    console.log("map set");
    // setNodeMap(masterNodeMap);
    // setStartLoc(cl);
    // console.log("hello??");
  };

  const startAlgorithm = async () => {
    const start = 100000000;
    console.log(map);
    const test = map.modifiedDijsktra(start);
    console.log(test);
    setArray(test);

    //console.log(await testAlg());
  };

  const finish = async () => {
    const copy = array.slice();
    const test = await breakDown(distanceState, copy, nodeMap);
    console.log(test);
  };

  const mapReset = async () => {
    const newMap = new Map();
    setNodeMap(newMap);
    console.log(nodeMap);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setDistanceState(value);
  };

  return (
    <div>
      <h1>geo</h1>
      <button onClick={onPress}>test</button>
      <input
        className="distance"
        type="text"
        value={distanceState}
        onChange={(e) => handleInputChange(e)}
        id="dist"
        placeholder="Enter distance in meters"
      />
      <button onClick={startAlgorithm}>algorize</button>
      <div>
        <button onClick={finish}>finish</button>
      </div>
      <div>
        <button onClick={mapReset}>map reset</button>
      </div>
    </div>
  );
};

export default Geo;
