export const RouteInfoBox = (props) => {
    console.log(props);
    return (
        <div className="flex flex-col bg-white shadow-xl rounded-md p-4 text-black">
            <span className="font-sans text-center text-2xl">RESULTS </span>
            <div>
                <span className="font-sans">Distance: </span>
                <span>{props.routeInfo.distance}</span>
                <br />
                <span className="font-sans">Elevation: </span>
                <span>
                    {(props.routeInfo.elevation * 3.28084).toFixed(2)} ft
                </span>
            </div>
        </div>
    );
};
