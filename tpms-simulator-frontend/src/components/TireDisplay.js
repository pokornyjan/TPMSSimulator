
function TireDisplay({ position, pressure, temperature }) {
  return (
    <div className="tire">
      <h3>{position}</h3>
      <p>Pressure: {pressure} PSI</p>
      <p>Temperature: {temperature} °C</p>
    </div>
  );
}

export default TireDisplay;