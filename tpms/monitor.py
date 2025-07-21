from typing import Dict, List

from sensors.tire_sensor import TireSensor


class TPMSMonitor:
    def __init__(self, sensors: List[TireSensor]):
        self.sensors = sensors
        self.pressure_limits = (28.0, 36.0)
        self.temperature_limit = 60.0
        
    def check_sensors(self) -> List[Dict]:
        alerts = []
        
        for sensor in self.sensors:
            reading = sensor.read_all()
            tire_warnings = []
            
            if reading["pressure"] < self.pressure_limits[0]:
                tire_warnings.append("LOW_PRESSURE")
            elif reading["pressure"] > self.pressure_limits[1]:
                tire_warnings.append("HIGH_PRESSURE")
            
            if reading["temperature"] > self.temperature_limit:
                tire_warnings.append("HIGH_TEMPERATURE")
            
            alerts.append({
                "position": reading["position"],
                "pressure": reading["pressure"],
                "temperature": reading["temperature"],
                "warnings": tire_warnings
            })
            
        return alerts