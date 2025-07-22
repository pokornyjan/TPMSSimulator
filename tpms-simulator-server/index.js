const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

function generateTireData() {
  const basePressure = 32;
  const baseTemp = 28;

  const randomize = (base, range = 2) =>
    +(base + Math.random() * range - range / 2).toFixed(1);

  return {
    frontLeft: {
      pressure: randomize(basePressure),
      temperature: randomize(baseTemp),
    },
    frontRight: {
      pressure: randomize(basePressure),
      temperature: randomize(baseTemp),
    },
    rearLeft: {
      pressure: randomize(basePressure),
      temperature: randomize(baseTemp),
    },
    rearRight: {
      pressure: randomize(basePressure),
      temperature: randomize(baseTemp),
    },
  };
}

app.get("/tpms-data", (req, res) => {
  const data = generateTireData();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚗 TPMS simulator server running on http://localhost:${PORT}`);
});
