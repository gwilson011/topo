import "./App.css";
import { Map } from "./Map.js";
import { useEffect, useState } from "react";
import { RouteInfoBox } from "./RouteInfoBox.js";

function App() {
    const [distance, setDistance] = useState();
    const [long, setLong] = useState();
    const [lat, setLat] = useState();
    const [submittedDistancce, setSubmittedDistance] = useState(0);
    const [startPoint, setStartPoint] = useState([37.7749, -122.4194]);
    const [selectedOption, setSelectedOption] = useState("current");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [routeInfo, setRouteInfo] = useState();

    const handleInputChange = (e) => {
        const { value } = e.target;
        setDistance(value);
    };
    const handleLongChange = (e) => {
        const { value } = e.target;
        setLong(value);
    };
    const handleLatChange = (e) => {
        const { value } = e.target;
        setLat(value);
    };

    const handleStartPointChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const startAlgorithm = async () => {
        if (isNaN(parseFloat(distance))) {
            setError("Invalid longitude and/or latitude");
            return;
        }
        if (parseFloat(distance) > 15) {
            setError("Value exceeds 15");
            return;
        }
        if (parseFloat(distance) === submittedDistancce) {
            return;
        }
        setLoading(true);
        if (selectedOption === "current") {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                console.log(position);
                setStartPoint([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);
                console.log("updated");
            } catch (error) {
                console.error("Error getting location:", error);
                setError("Could not get current location");
            }
        } else {
            let lt = parseFloat(lat);
            let lg = parseFloat(long);
            if (!isNaN(lt) && !isNaN(lg)) {
                setStartPoint([lt, lg]);
            } else {
                setError("Invalid longitude and/or latitude");
            }
        }
        setSubmittedDistance(parseFloat(distance));
        setError(null);
    };

    useEffect(() => {
        console.log(routeInfo);
    }, [routeInfo]);

    return (
        <div className="flex flex-row justify-between">
            <div className="flex justify-center bg-white w-[50%] gap-4">
                <div className="flex flex-col gap-3 justify-center">
                    <div className="flex justify-center w-auto">
                        <h1 className="font-sans text-black text-5xl">TOPO</h1>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-center gap-3">
                            <select
                                className="rounded-sm p-2 w-full bg-gray-200"
                                id="location-select"
                                value={selectedOption}
                                onChange={handleStartPointChange}
                            >
                                <option value="current">
                                    Current Location
                                </option>
                                <option value="custom">
                                    Custom Coordinates
                                </option>
                            </select>
                        </div>
                        {selectedOption === "custom" && (
                            <div className="flex flex-row items-center gap-2">
                                <label
                                    className="font-sans text-black"
                                    htmlFor="latitude"
                                >
                                    LAT{" "}
                                </label>
                                <input
                                    className="distance rounded-sm p-2 w-[90px] bg-gray-200"
                                    type="number"
                                    id="latitude"
                                    placeholder=""
                                    onChange={(e) => handleLatChange(e)}
                                />
                                <label
                                    className="font-sans text-black"
                                    htmlFor="longitude"
                                >
                                    LONG{" "}
                                </label>
                                <input
                                    className="distance rounded-sm p-2 w-[90px] bg-gray-200"
                                    type="number"
                                    id="longitude"
                                    placeholder=""
                                    onChange={(e) => handleLongChange(e)}
                                />
                            </div>
                        )}
                        <div className="flex justify-center gap-3">
                            <input
                                className="distance rounded-sm p-2 bg-gray-200"
                                type="text"
                                value={distance}
                                onChange={(e) => handleInputChange(e)}
                                id="dist"
                                placeholder="Enter distance in miles"
                            />
                            <button
                                className="text-black bg-blue-300 rounded-sm px-3 font-sans"
                                onClick={startAlgorithm}
                            >
                                ROUTE
                            </button>
                        </div>
                        {error && (
                            <div className="text-center text-red-400">
                                {error}
                            </div>
                        )}
                        <div className="flex text-black text-center w-[280px]">
                            It's simple. Enter the straight-line distance you
                            want to run. Get a route with minimal elevation
                            gain. Up to 15 miles.
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="absolute top-0 right-0 flex items-center justify-center bg-white bg-opacity-50 z-10 w-[50%] h-full">
                    <span className="text-black text-xl"></span>
                    <img
                        className="opacity-50 w-[200px]"
                        src={require("./images/loading.gif")}
                        alt="Loading..."
                    />
                </div>
            )}
            <Map
                maxDistance={submittedDistancce}
                start={startPoint}
                setLoading={setLoading}
                setRouteInfo={setRouteInfo}
            />
            {routeInfo && !loading && (
                <div className="absolute top-0 right-0 flex items-left justify-left p-[10%] z-10 w-[50%]">
                    <RouteInfoBox routeInfo={routeInfo} />
                </div>
            )}
        </div>
    );
}

export default App;
