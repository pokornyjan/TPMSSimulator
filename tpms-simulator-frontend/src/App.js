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
            <TireDisplay position="Front Left" {...data.frontLeft} />
            <TireDisplay position="Front Right" {...data.frontRight} />
            <TireDisplay position="Rear Left" {...data.rearLeft} />
            <TireDisplay position="Rear Right" {...data.rearRight} />
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
