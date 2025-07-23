import { useEffect, useState } from "react";
import "./App.css";
import StatusIndicator from "./components/StatusIndicator";
import TireDisplay from "./components/TireDisplay";
import TPMSGraph from "./components/TPMSGraph";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:4000/tpms-data")
        .then((res) => res.json())
        .then(setData)
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

return (
  <div className="App">
    <h1>TPMS Simulator</h1>
    {data ? (
      <>
        <div className="tire-grid">
            <TireDisplay position="frontLeft" {...data.frontLeft} />
            <TireDisplay position="frontRight" {...data.frontRight} />
            <TireDisplay position="rearLeft" {...data.rearLeft} />
            <TireDisplay position="rearRight" {...data.rearRight} />
        </div>

        <div className="graph-section">
          <h2>Pressure & Temperature Graph</h2>
          <TPMSGraph data={data} />
        </div>

        <StatusIndicator data={data} />
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
}

export default App;
