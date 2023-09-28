import axios from "axios";
const querystring = require("querystring-es3");
//just to commit

export const queryIntersections = async (cl, rad) => {
  return new Promise((resolve, reject) => {
    console.log("querying intersections...");
    console.log(cl, rad);
    axios
      .post(
        "https://overpass-api.de/api/interpreter",
        querystring.stringify({
          data:
            "[out:json];node(around:" +
            rad +
            "," +
            cl.lat +
            "," +
            cl.lng +
            ')["highway"~"stop|traffic_signals"]["highway"!~"bus_stop"];out;',
        })

        //https://overpass-api.de/api/interpreter?[out:json];node(around:321.8688995785127,34.06439952753623,-118.45143404981685)["highway"~"stop|traffic_signals"]["highway"!~"bus_stop"];out;
      )
      .then((response) => {
        console.log(response.data);
        resolve(response.data);
      })
      .catch(console.error);
  });
};

export const getNodesOnWayOf = async (nodeID) => {
  return new Promise((resolve, reject) => {
    console.log("querying ways for " + nodeID + "...");
    axios
      .post(
        "https://overpass-api.de/api/interpreter",
        querystring.stringify({
          data:
            "[out:json];(node(" +
            nodeID +
            "););way(bn);out body;>;out skel qt;",
        })
      )
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        resolve(response.data.elements);
      })
      .catch(console.error);
  });
};
