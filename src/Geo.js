import React, { useState } from "react";
import "./helpers/Dijkstra";
import { WeightedGraph, testAlg } from "./helpers/Dijkstra";
import {
  getArea,
  toMeters,
  areaUnderCurve,
  simplify,
} from "./helpers/Calculate";
import { retrievePath, breakDown } from "./helpers/BuildMap";
import { queryIntersections } from "./helpers/OSM";
import {
  getCurrentLocation,
  getDistanceBetween,
  getElevationBetween,
} from "./helpers/Google";

//yes
const Geo = () => {
  const [distanceState, setDistanceState] = useState("");
  const [map, setMap] = useState(new WeightedGraph(null));
  const [nodeMap, setNodeMap] = useState();
  const [startLoc, setStartLoc] = useState();
  const [array, setArray] = useState(null);

  const onPress = async () => {
    let cl, intersectionData;
    // try {
    //   cl = await getCurrentLocation();
    // } catch (error) {
    //   console.error(error.message);
    // }
    cl = { lat: 34.06439952753623, lng: -118.45143404981685 };

    try {
      intersectionData = await queryIntersections(cl, toMeters(distanceState));
    } catch (error) {
      console.error(error.message);
    }

    let nodeList = await simplify(intersectionData.elements);

    const { wMap, nMap } = {};

    try {
      await retrievePath(cl, nodeList, parseFloat(distanceState));
    } catch (error) {
      console.error(error.message);
    }

    console.log("results: ", wMap, nMap);
    setMap(wMap);
    setNodeMap(nMap);
    setStartLoc(cl);
    console.log("hello??");
  };

  const startAlgorithm = async () => {
    const start = "100000000";
    console.log(nodeMap);
    const test = map.modifiedDijsktra(start);
    console.log(test);
    setArray(test);

    //console.log(await testAlg());
  };

  const finish = async () => {
    const copy = array.slice();
    breakDown(distanceState, copy);
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
    </div>
  );
};

export default Geo;
