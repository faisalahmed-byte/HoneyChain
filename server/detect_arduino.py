import serial
import serial.tools.list_ports
import time

ports = [p.device for p in serial.tools.list_ports.comports()]
print(f"Available Ports: {ports}")

for baud in [9600, 115200]:
    for port in ports:
        try:
            print(f"Testing {port} at {baud} baud...")
            s = serial.Serial(port, baud, timeout=2)
            time.sleep(1.5)
            lines = []
            start = time.time()
            while time.time() - start < 3:
                if s.in_waiting > 0:
                    line = s.readline().decode('utf-8', errors='ignore').strip()
                    if line:
                        lines.append(line)
            s.close()
            if lines:
                print(f"--> SUCCESS at {baud} baud on {port}: {lines}")
            else:
                print(f"--> No data at {baud} baud on {port}")
        except Exception as e:
            print(f"--> Error on {port}: {e}")
