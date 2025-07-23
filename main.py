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


class LeakagePayload(BaseModel):
    position: str
    leaking: bool
    leak_rate: float = 0.1

class LeakRequest(BaseModel):
    position: str
    leaking: bool
    leak_rate: float = 0.1

@app.post("/set-leakage")
def set_leakage(data: LeakRequest):
    position = data.position
    if position not in sensors:
        raise HTTPException(status_code=400, detail="Invalid tire position")

    sensors[position].set_leaking(data.leaking, data.leak_rate)
    return {"message": f"Leak state updated for {position}"}