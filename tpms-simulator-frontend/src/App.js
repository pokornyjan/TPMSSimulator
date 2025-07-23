import { useEffect, useState } from "react";

const SENSOR_POSITIONS = ["frontLeft", "frontRight", "rearLeft", "rearRight"];

function App() {
  const [tpmsData, setTpmsData] = useState({});
  const [intensity, setIntensity] = useState(1);
  const [leaks, setLeaks] = useState({
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:4000/tpms-data")
        .then((res) => res.json())
        .then((data) => setTpmsData(data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleIntensityChange = (e) => {
    const value = parseFloat(e.target.value);
    setIntensity(value);
    fetch("http://localhost:4000/set-fluctuation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intensity: value }),
    });
  };

  const toggleLeak = (pos) => {
    const newState = !leaks[pos];
    setLeaks((prev) => ({ ...prev, [pos]: newState }));
    fetch("http://localhost:4000/set-leakage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: pos, leaking: newState }),
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>TPMS Simulator Dashboard</h1>

      <div style={{ margin: "20px 0" }}>
        <label>Fluctuation Intensity: {intensity}</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={intensity}
          onChange={handleIntensityChange}
        />
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {SENSOR_POSITIONS.map((pos) => (
          <div key={pos} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", width: "200px" }}>
            <h3>{pos}</h3>
            <p><strong>Pressure:</strong> {tpmsData[pos]?.pressure ?? "..."}</p>
            <p><strong>Temperature:</strong> {tpmsData[pos]?.temperature ?? "..."}</p>
            <label>
              <input
                type="checkbox"
                checked={leaks[pos]}
                onChange={() => toggleLeak(pos)}
              />
              Leak?
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;