#!/usr/bin/python
import serial.tools.list_ports
import serial as sl

ports = serial.tools.list_ports.comports()
arduino_port = ""

for port, desc, hwid in sorted(ports):
    if "1A86:7523" in hwid:
        arduino_port = port


print("[DEBUG]: Found Walter @ \"{}\"".format(arduino_port))

ser = sl.Serial(arduino_port,9600)

print("[DEBUG]: Opened Walter @ \"{}\"".format(arduino_port))

while True:
    value = ser.readline().decode('utf-8').strip()
    print("Value: {}".format(value))

