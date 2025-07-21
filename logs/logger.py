import json
import os
from datetime import datetime


class TPMSLogger:
    def __init__(self, log_path="logs/pressure_log.json"):
        self.log_path = log_path
        os.makedirs(os.path.dirname(self.log_path), exist_ok=True)
        
        if not os.path.isfile(self.log_path):
            with open(self.log_path, "w") as f:
                json.dump([], f)
    
    
    def log(self, alerts: list):
        timestamp = datetime.utcnow().isoformat()
        entry = {
            "timestamp": timestamp,
            "readings": alerts
        }

        with open(self.log_path, "r+") as f:
            data = json.load(f)
            data.append(entry)
            f.seek(0)
            json.dump(data, f, indent=2)
    