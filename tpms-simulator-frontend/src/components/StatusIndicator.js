
function StatusIndicator({ data }) {
  const isSafe = Object.values(data).every(
    ({ pressure, temperature }) =>
      pressure >= 30 && pressure <= 36 && temperature <= 40
  );

  return (
    <div className={`status ${isSafe ? "safe" : "alert"}`}>
      {isSafe ? "✅ All tires are within safe range." : "⚠️ Warning: Check tire conditions!"}
    </div>
  );
}

export default StatusIndicator;