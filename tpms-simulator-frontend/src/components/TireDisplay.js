import { useState } from "react";

function TireDisplay({ position, pressure, temperature }) {
  const [leaking, setLeaking] = useState(false);
  const [leakRate, setLeakRate] = useState(0.1);

  const updateLeakStatus = async (newLeaking = leaking, newRate = leakRate) => {
    await fetch("http://localhost:4000/set-leakage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position: position.toLowerCase().replace(/\s/g, ""),
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

  const handleLeakRateChange = async (e) => {
    const newRate = parseFloat(e.target.value);
    setLeakRate(newRate);
    if (leaking) {
      await updateLeakStatus(leaking, newRate);
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
            Leak Rate: {leakRate.toFixed(2)} PSI
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={leakRate}
              onChange={handleLeakRateChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default TireDisplay;