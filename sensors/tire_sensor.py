import random

class TireSensor:
    def __init__(self, position, pressure=32.0, temperature=25.0, leaking=False, leak_rate=0.1):
        self.position = position
        self.pressure = pressure
        self.temperature = temperature
        self.leaking = leaking
        self.leak_rate = leak_rate
        self.fluctuation_intensity = 1.0  # default multiplier

    def set_leaking(self, leaking: bool, leak_rate: float = 0.1):
        self.leaking = leaking
        self.leak_rate = leak_rate

    def set_fluctuation_intensity(self, intensity: float):
        self.fluctuation_intensity = intensity

    def read(self):
        intensity = self.fluctuation_intensity

        pressure_noise = random.uniform(-0.2, 0.2) * intensity
        temp_noise = random.uniform(-0.5, 0.5) * intensity

        if self.leaking:
            self.pressure -= self.leak_rate
            self.pressure = max(self.pressure, 0)

        self.pressure += pressure_noise
        self.temperature += temp_noise

        return {
            "position": self.position,
            "pressure": round(self.pressure, 2),
            "temperature": round(self.temperature, 2)
        }