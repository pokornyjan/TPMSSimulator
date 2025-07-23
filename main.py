from fastapi import FastAPI, HTTPException
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

class LeakSettings(BaseModel):
    position: str
    leaking: bool
    leak_rate: float

@app.post("/set-leakage")
async def set_leakage(settings: LeakSettings):
    sensor = sensors.get(settings.position)
    if sensor:
        sensor.leaking = settings.leaking
        sensor.leak_rate = settings.leak_rate
        return {"status": "success"}
    return {"status": "error", "message": "Invalid sensor position"}
