import json
import os
from collections import defaultdict
from datetime import datetime

import matplotlib.pyplot as plt

LOG_FILE = "logs/pressure_log.json"

def load_log():
    if not os.path.exists(LOG_FILE):
        print("Log file not found.")
        return []

    with open(LOG_FILE, "r") as f:
        return json.load(f)

def plot_all_tires(log_data):
    # Organize data by tire position
    data_by_tire = defaultdict(lambda: {"timestamps": [], "pressure": [], "temperature": []})

    for entry in log_data:
        timestamp = datetime.fromisoformat(entry["timestamp"])
        for reading in entry["readings"]:
            pos = reading["position"]
            data_by_tire[pos]["timestamps"].append(timestamp)
            data_by_tire[pos]["pressure"].append(reading["pressure"])
            data_by_tire[pos]["temperature"].append(reading["temperature"])

    tire_positions = sorted(data_by_tire.keys())
    fig, axs = plt.subplots(nrows=2, ncols=2, figsize=(14, 8), sharex=True)
    fig.suptitle("Tire Pressure and Temperature Over Time")

    for ax, pos in zip(axs.flat, tire_positions):
        data = data_by_tire[pos]
        ax2 = ax.twinx()

        # Plot pressure
        ax.plot(data["timestamps"], data["pressure"], label="Pressure (PSI)", color="tab:blue")
        ax.set_ylabel("Pressure (PSI)", color="tab:blue")
        ax.tick_params(axis="y", labelcolor="tab:blue")

        # Plot temperature
        ax2.plot(data["timestamps"], data["temperature"], label="Temp (°C)", color="tab:red", linestyle="--")
        ax2.set_ylabel("Temp (°C)", color="tab:red")
        ax2.tick_params(axis="y", labelcolor="tab:red")

        ax.set_title(pos.replace("_", " ").title())
        ax.grid(True)

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig("tpms_graphs/tire_data_overview.png")

if __name__ == "__main__":
    log_data = load_log()
    if log_data:
        os.makedirs("tpms_graphs", exist_ok=True)
        plot_all_tires(log_data)