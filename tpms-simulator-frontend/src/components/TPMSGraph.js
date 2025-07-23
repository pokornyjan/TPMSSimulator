import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

function TPMSGraph({ data }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();

    const newEntry = {
      time: timestamp,
      FL: data.frontLeft.pressure,
      FR: data.frontRight.pressure,
      RL: data.rearLeft.pressure,
      RR: data.rearRight.pressure,
    };

    setHistory(prev => [...prev.slice(-20), newEntry]); // keep last 20 readings
  }, [data]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Pressure Over Time</h2>
      <ResponsiveContainer>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[20, 40]} unit=" PSI" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="FL" stroke="#8884d8" name="Front Left" />
          <Line type="monotone" dataKey="FR" stroke="#82ca9d" name="Front Right" />
          <Line type="monotone" dataKey="RL" stroke="#ffc658" name="Rear Left" />
          <Line type="monotone" dataKey="RR" stroke="#ff7300" name="Rear Right" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TPMSGraph;
