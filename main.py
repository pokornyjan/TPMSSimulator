import time

from logs.logger import TPMSLogger
from sensors.tire_sensor import TireSensor
from tpms.monitor import TPMSMonitor

sensors = [
    TireSensor("front_left"),
    TireSensor("front_right"),
    TireSensor("rear_left"),
    TireSensor("rear_right")
]

monitor = TPMSMonitor(sensors)
logger = TPMSLogger()

for _ in range(20):
    alerts = monitor.check_sensors()

    for alert in alerts:
        print(alert)

    logger.log(alerts)
    time.sleep(1)