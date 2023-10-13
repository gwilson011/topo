import logo from "./logo.svg";
import "./App.css";
import Geo from "./Geo";
import MapWithRoute from "./MapContainer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Geo />
        <MapWithRoute />
      </header>
    </div>
  );
}

export default App;
