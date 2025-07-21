from sensors.tire_sensor import TireSensor

sensors = [
    TireSensor("front_left"),
    TireSensor("front_right"),
    TireSensor("rear_left"),
    TireSensor("rear_right")
]

for sensor in sensors:
    data = sensor.read_all()
    print(data)