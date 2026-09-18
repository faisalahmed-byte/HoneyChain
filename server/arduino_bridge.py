import serial
import serial.tools.list_ports
import requests
import time
import re
import sys

# Configuration
SERVER_URL = "http://localhost:5000/api/iot/sensor"
DEFAULT_HIVE_ID = "HIVE-001"
DEFAULT_BAUD = 9600

def get_com_port():
    com_ports = serial.tools.list_ports.comports()
    if not com_ports:
        print("❌ No COM ports detected! Please connect your Arduino USB cable.")
        return None
    for p in com_ports:
        # Detect Arduino Uno by USB VID 2341 or description
        if "2341" in getattr(p, "hwid", "") or "arduino" in p.description.lower():
            return p.device
    for p in com_ports:
        if p.device == "COM6":
            return "COM6"
    return com_ports[0].device

def parse_sensor_data(line):
    """
    Parses various common formats:
    1. CSV format: 34.5, 68.2 (temp, humidity) or 34.5, 68.2, 19.5 (temp, hum, weight)
    2. Text format: "Temp: 34.5 C, Humidity: 68 %"
    3. JSON format: {"temperature": 34.5, "humidity": 68}
    """
    line = line.strip()
    
    # 1. Try CSV regex: e.g. "34.5, 68.2" or "34.5,68.2"
    csv_match = re.match(r"^([0-9\.]+)\s*,\s*([0-9\.]+)(?:\s*,\s*([0-9\.]+))?", line)
    if csv_match:
        temp = float(csv_match.group(1))
        hum = float(csv_match.group(2))
        wt = float(csv_match.group(3)) if csv_match.group(3) else 19.4
        return temp, hum, wt

    # 2. Try text pattern: "temp: 34.5" / "humidity: 65.2"
    temp_search = re.search(r"(?:temp|temperature)[\s:=]*([0-9\.]+)", line, re.I)
    hum_search = re.search(r"(?:hum|humidity)[\s:=]*([0-9\.]+)", line, re.I)
    wt_search = re.search(r"(?:weight|wt)[\s:=]*([0-9\.]+)", line, re.I)
    
    if temp_search and hum_search:
        temp = float(temp_search.group(1))
        hum = float(hum_search.group(1))
        wt = float(wt_search.group(1)) if wt_search else 19.4
        return temp, hum, wt
        
    return None, None, None

def main():
    port = sys.argv[1] if len(sys.argv) > 1 else get_com_port()
    baud = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_BAUD
    
    if not port:
        return

    print("=" * 65)
    print(" HONEY CHAIN - ARDUINO HARDWARE TO WEBSITE LIVE BRIDGE")
    print("=" * 65)
    print(f"[Port]:      {port}")
    print(f"[Baud]:      {baud}")
    print(f"[Endpoint]:  {SERVER_URL}")
    print(f"[Hive]:      {DEFAULT_HIVE_ID}")
    print("-" * 65)
    print("Connecting to Arduino on " + str(port) + "... (press Ctrl+C to stop)\n")

    try:
        ser = serial.Serial(port, baud, timeout=2)
        time.sleep(2) # Wait for Arduino auto-reset on connection
        print(f"[OK] Connected to {port} successfully! Listening for sensor data...\n")
    except Exception as e:
        print(f"[ERROR] Error opening {port}: {e}")
        print("Tip: Make sure the Arduino IDE Serial Monitor is CLOSED so this port is free.")
        return

    while True:
        try:
            if ser.in_waiting > 0:
                raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                if not raw_line:
                    continue

                print(f"[Arduino Raw]: {raw_line}")
                temp, hum, wt = parse_sensor_data(raw_line)

                if temp is not None and hum is not None:
                    payload = {
                        "hiveId": DEFAULT_HIVE_ID,
                        "temperature": temp,
                        "humidity": hum,
                        "weight": wt,
                        "battery": 96.0
                    }
                    try:
                        res = requests.post(SERVER_URL, json=payload, timeout=3)
                        if res.status_code == 200:
                            print(f"  --> [SYNCED TO WEB & SUPABASE] Temp: {temp} C | Hum: {hum} % | Weight: {wt} kg | Status: 200 OK")
                        else:
                            print(f"  [WARN] Server responded with status: {res.status_code}")
                    except Exception as req_err:
                        print(f"  [ERROR] Failed to post to server: {req_err}")
                else:
                    print(f"  [INFO] Raw received: {raw_line}")
            time.sleep(0.1)
        except KeyboardInterrupt:
            print("\nBridge stopped by user.")
            ser.close()
            break
        except serial.SerialException as se:
            print(f"[DISCONNECTED] Arduino disconnected ({se}). Waiting for reconnect...")
            try:
                ser.close()
            except Exception:
                pass
            time.sleep(2)
            while True:
                try:
                    detected_port = sys.argv[1] if len(sys.argv) > 1 else get_com_port()
                    if detected_port:
                        ser = serial.Serial(detected_port, baud, timeout=2)
                        time.sleep(2)
                        print(f"[OK] Reconnected to {detected_port} successfully!\n")
                        break
                except Exception:
                    pass
                time.sleep(2)
        except Exception as e:
            print(f"Notice: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()
