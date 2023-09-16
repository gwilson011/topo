import React, { useState } from "react";
import "./helpers/Dijkstra";
import { WeightedGraph, testAlg } from "./helpers/Dijkstra";
import { getArea, toMeters, areaUnderCurve } from "./helpers/Calculate";
import { retrievePath } from "./helpers/BuildMap";
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
  const [startLoc, setStartLoc] = useState();
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
    setMap(
      await retrievePath(
        cl,
        intersectionData.elements,
        parseFloat(distanceState)
      )
    );

    setStartLoc(cl);
  };

  const startAlgorithm = async () => {
    const start = "100000000";
    console.log(map);
    console.log(map.modifiedDijsktra(start));
    //console.log(await testAlg());
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
    </div>
  );
};

export default Geo;
