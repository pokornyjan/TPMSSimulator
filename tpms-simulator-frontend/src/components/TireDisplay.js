import { useState } from "react";

function TireDisplay({ position, pressure, temperature }) {
  const [leaking, setLeaking] = useState(false);
  const [leakRate, setLeakRate] = useState(0.1);
  const [pendingLeakRate, setPendingLeakRate] = useState(0.1);

  const updateLeakStatus = async (newLeaking = leaking, newRate = leakRate) => {
    await fetch("http://localhost:4000/set-leakage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position: position,
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

   const handlePump = async () => {
    try {
      const res = await fetch("http://localhost:4000/pump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position }),
      });
      const data = await res.json();
      console.log("Pump result:", data);
      // optionally, force refresh or update pressure state if you have local pressure state
    } catch (err) {
      console.error("Pump error:", err);
    }
  };

  return (
    <div className="tire-card">
      <h3>{position}</h3>
      <p>Pressure: {pressure} PSI</p>
      <p>Temperature: {temperature} °C</p>
      <button onClick={handlePump} style={{ marginTop: "1rem" }}>
        Pump Pressure +1 PSI
      </button>
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