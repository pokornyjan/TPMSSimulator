from sensors.tire_sensor import TireSensor
from tpms.monitor import TPMSMonitor

sensors = [
    TireSensor("front_left"),
    TireSensor("front_right"),
    TireSensor("rear_left"),
    TireSensor("rear_right")
]

monitor = TPMSMonitor(sensors)

alerts = monitor.check_sensors()

for alert in alerts:
    print(alert)