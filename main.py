from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sensors.tire_sensor import TirePressureSensor

app = FastAPI()

# Enable CORS for frontend on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize sensors
sensors = {
    "frontLeft": TirePressureSensor("frontLeft"),
    "frontRight": TirePressureSensor("frontRight"),
    "rearLeft": TirePressureSensor("rearLeft"),
    "rearRight": TirePressureSensor("rearRight")
}

@app.get("/tpms-data")
def get_tpms_data():
    return {pos: sensor.read() for pos, sensor in sensors.items()}


class FluctuationPayload(BaseModel):
    intensity: float

@app.post("/set-fluctuation")
def set_fluctuation(payload: FluctuationPayload):
    for sensor in sensors.values():
        sensor.set_fluctuation_intensity(payload.intensity)
    return {"status": "ok", "intensity": payload.intensity}


class LeakagePayload(BaseModel):
    position: str
    leaking: bool
    leak_rate: float = 0.1

@app.post("/set-leakage")
def set_leakage(payload: LeakagePayload):
    sensor = sensors.get(payload.position)
    if sensor:
        sensor.set_leaking(payload.leaking, payload.leak_rate)
        return {"status": "ok", "sensor": payload.position, "leaking": payload.leaking}
    return {"status": "error", "message": "Invalid sensor position"}