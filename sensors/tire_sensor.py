import random

class TireSensor:
    def __init__(self, position: str, base_pressure=32.0, base_temp=25.0):
        self.position = position
        self.base_pressure = base_pressure
        self.base_temp = base_temp
    
    def read_pressure(self):
        return round(self.base_pressure + random.uniform(-1.5, 1.5), 1)

    def read_temperature(self):
        return round(self.base_temp + random.uniform(-2.0, 3.0), 1)
    
    def read_all(self):
        return {
            "position": self.position,
            "pressure": self.read_pressure(),
            "temperature": self.read_temperature()
        }