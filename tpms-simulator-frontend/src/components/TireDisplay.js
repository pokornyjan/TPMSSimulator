import { useState } from "react";

function TireDisplay({ position, pressure, temperature }) {
  const [leaking, setLeaking] = useState(false);
  const [leakRate, setLeakRate] = useState(0.1);
  const [pendingLeakRate, setPendingLeakRate] = useState(0.1); // separate input value

  const updateLeakStatus = async (newLeaking = leaking, newRate = leakRate) => {
    await fetch("http://localhost:4000/set-leakage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      position: position
                .replace(" ", "") // remove space
                .replace("F", "f")
                .replace("R", "r"), // preserve camelCase
        leaking: newLeaking,
        leak_rate: newRate,
      }),
    });
  };

  const handleLeakToggle = async () => {
    const newLeaking = !leaking;
    setLeaking(newLeaking);
    await updateLeakStatus(newLeaking, leakRate);
  };

  const handleLeakRateInputChange = (e) => {
    setPendingLeakRate(parseFloat(e.target.value));
  };

  const handleLeakRateSubmit = async () => {
    setLeakRate(pendingLeakRate);
    if (leaking) {
      await updateLeakStatus(leaking, pendingLeakRate);
    }
  };

  return (
    <div className="tire-card">
      <h3>{position}</h3>
      <p>Pressure: {pressure} PSI</p>
      <p>Temperature: {temperature} °C</p>

      <label>
        <input type="checkbox" checked={leaking} onChange={handleLeakToggle} />
        Leak Enabled
      </label>

      {leaking && (
        <div style={{ marginTop: "0.5rem" }}>
          <label>
            Leak Rate (PSI per read):
            <input
              type="number"
              min="0.05"
              max="0.5"
              step="0.01"
              value={pendingLeakRate}
              onChange={handleLeakRateInputChange}
              style={{ width: "80px", marginLeft: "10px" }}
            />
          </label>
          <button onClick={handleLeakRateSubmit} style={{ marginLeft: "10px" }}>
            Submit Leak Rate
          </button>
        </div>
      )}
    </div>
  );
}

export default TireDisplay;