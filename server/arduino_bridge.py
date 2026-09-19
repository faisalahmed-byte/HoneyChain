import serial
import serial.tools.list_ports
import requests
import time
import re
import sys
import os

# Ensure safe UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ============================================================
# CONFIGURATION
# ============================================================
HOST_SERVER_URL = "http://localhost:5000/api/iot/sensor"
TARGET_HIVE_IDS = ["HIVE-001", "HIVE-007"]
DEFAULT_BAUD = 9600

# Supabase Cloud Configuration (Direct Sync to Vercel)
SUPABASE_URL = "https://ypywpedlduwpyzzrxova.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweXdwZWRsZHV3cHl6enJ4b3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTkwMzYsImV4cCI6MjEwNTEzNTAzNn0.4xGD8sPjzM39psPDOMW0om1fVK_J3slBquNjgmmz_TI"
SUPABASE_HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def get_com_port():
    com_ports = list(serial.tools.list_ports.comports())
    if not com_ports:
        print("❌ No COM ports detected! Please connect your Arduino USB cable.")
        return None

    # Priority 1: Match known Arduino / CH340 / CP210 / FTDI chips
    for p in com_ports:
        desc = (p.description or "").lower()
        hwid = getattr(p, "hwid", "").lower()
        if any(sig in (desc + " " + hwid) for sig in ["ch340", "1a86", "arduino", "cp210", "ftdi", "usb-serial", "2341"]):
            return p.device

    # Priority 2: Filter out motherboard SOL / AMT ports (e.g. COM3 Intel AMT)
    candidates = [p for p in com_ports if "sol" not in (p.description or "").lower() and "amt" not in (p.description or "").lower()]
    if candidates:
        return candidates[0].device

    return com_ports[0].device

def parse_sensor_data(line):
    """
    Parses various common sensor string formats:
    1. "Temperature: 27.8 C | Humidity: 57 %"  <-- Exact match for Arduino code
    2. "Temp: 27.8C, Hum: 57%"
    3. CSV: "27.8, 57" or "27.8, 57, 19.4"
    4. JSON: {"temperature": 27.8, "humidity": 57}
    """
    line = line.strip()

    # Match Temperature and Humidity text pattern
    temp_search = re.search(r"(?:temp|temperature)[\s:=]*([0-9\.]+)", line, re.I)
    hum_search = re.search(r"(?:hum|humidity)[\s:=]*([0-9\.]+)", line, re.I)
    wt_search = re.search(r"(?:weight|wt)[\s:=]*([0-9\.]+)", line, re.I)

    if temp_search and hum_search:
        temp = float(temp_search.group(1))
        hum = float(hum_search.group(1))
        wt = float(wt_search.group(1)) if wt_search else 19.4
        return temp, hum, wt

    # Fallback: CSV regex e.g. "27.8, 57"
    csv_match = re.match(r"^([0-9\.]+)\s*,\s*([0-9\.]+)(?:\s*,\s*([0-9\.]+))?", line)
    if csv_match:
        temp = float(csv_match.group(1))
        hum = float(csv_match.group(2))
        wt = float(csv_match.group(3)) if csv_match.group(3) else 19.4
        return temp, hum, wt

    return None, None, None

def sync_to_cloud_supabase(temp, hum, wt):
    """Directly updates Supabase Cloud so Vercel displays live data instantly for all hives matching LCD"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/beehives?hive_id=neq.XYZ"
        payload = {
            "temperature_c": round(temp, 1),
            "humidity_pct": int(round(hum)),
            "weight_kg": round(wt, 1)
        }
        res = requests.patch(url, headers=SUPABASE_HEADERS, json=payload, timeout=3)
        return res.status_code in [200, 204]
    except Exception:
        return False

def sync_to_host_backend(temp, hum, wt):
    """Sends telemetry to local Node backend for local SQLite & UI"""
    try:
        payload = {
            "hiveId": "HIVE-001",
            "syncAll": True,
            "temperature": round(temp, 1),
            "humidity": int(round(hum)),
            "weight": round(wt, 1),
            "battery": 95.0
        }
        res = requests.post(HOST_SERVER_URL, json=payload, timeout=2)
        return res.status_code == 200
    except Exception:
        return False


def main():
    port = sys.argv[1] if len(sys.argv) > 1 else get_com_port()
    baud = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_BAUD

    if not port:
        print("[ERROR] Could not determine serial port. Please specify port: python arduino_bridge.py COM7")
        return

    print("=" * 72)
    print("  * HONEY CHAIN - ARDUINO DHT11 / DHT22 HARDWARE DUAL-SYNC BRIDGE *")
    print("=" * 72)
    print(f"  [Port]:         {port}")
    print(f"  [Baudrate]:     {baud}")
    print(f"  [Hardware]:     DHT11 / DHT22 Sensor (Pin 7) + 16x2 LCD")
    print(f"  [Target Hives]: {', '.join(TARGET_HIVE_IDS)}")
    print(f"  [Sync Targets]:")
    print(f"    1. HOST Backend:    {HOST_SERVER_URL}")
    print(f"    2. CLOUD & VERCEL:  {SUPABASE_URL}/rest/v1/beehives")
    print("=" * 72)
    print(f"Connecting to Arduino on {port}... (Press Ctrl+C to stop)\n")

    try:
        ser = serial.Serial(port, baud, timeout=2)
        time.sleep(2)  # Wait for Arduino auto-reset
        print(f"[OK] Connected to {port} successfully! Listening for live sensor frames...\n")
    except Exception as e:
        print(f"[ERROR] Error opening {port}: {e}")
        print("[TIP] Ensure the Arduino IDE Serial Monitor is CLOSED so the port is free.")
        return

    sample_count = 0

    while True:
        try:
            if ser.in_waiting > 0:
                raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                if not raw_line:
                    continue

                # Parse readings
                temp, hum, wt = parse_sensor_data(raw_line)

                if temp is not None and hum is not None:
                    # Ignore erroneous uninitialized 0.0 / 0% frames
                    if temp <= 0.0 and hum <= 0.0:
                        timestamp = time.strftime("%H:%M:%S")
                        print(f"[{timestamp}] [SENSOR WARN]: Sensor returned 0.0 C / 0% (Check pin wiring) - skipping bad frame", flush=True)
                        continue

                    sample_count += 1
                    timestamp = time.strftime("%H:%M:%S")

                    # 1. Sync to Supabase Cloud (for Vercel Live Display)
                    cloud_ok = sync_to_cloud_supabase(temp, hum, wt)

                    # 2. Sync to Host Local Server (for localhost:5000 / localhost:5173)
                    host_ok = sync_to_host_backend(temp, hum, wt)

                    cloud_status = "VERCEL: OK" if cloud_ok else "VERCEL: Pending"
                    host_status = "HOST: OK" if host_ok else "HOST: Offline"

                    print(f"[{timestamp}] #{sample_count:03d} | Temp: {temp:4.1f} C | Hum: {int(round(hum)):2d}% | Wt: {wt:4.1f}kg  -->  [{cloud_status}] | [{host_status}]", flush=True)
                else:
                    if any(header_word in raw_line for header_word in ["HONEY CHAIN", "Smart Hive", "Initializing", "===="]):
                        print(f"[Arduino Boot]: {raw_line}", flush=True)

            time.sleep(0.1)

        except KeyboardInterrupt:
            print("\n[STOP] Bridge stopped by user.")
            ser.close()
            break
        except serial.SerialException as se:
            print(f"[WARN] Serial connection lost ({se}). Attempting auto-reconnect...")
            try:
                ser.close()
            except Exception:
                pass
            time.sleep(2)
            while True:
                try:
                    p = sys.argv[1] if len(sys.argv) > 1 else get_com_port()
                    if p:
                        ser = serial.Serial(p, baud, timeout=2)
                        time.sleep(2)
                        print(f"[OK] Reconnected to {p} successfully!\n")
                        break
                except Exception:
                    pass
                time.sleep(2)
        except Exception as ex:
            time.sleep(0.5)

if __name__ == "__main__":
    main()
