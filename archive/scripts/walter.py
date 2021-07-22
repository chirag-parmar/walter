#!/usr/bin/python
import serial.tools.list_ports
import serial as sl

class Walter:
    def __init__(self, hwid):
        self.hwid = hwid
        self.serial_port = None
        self.serial_con = None

    def __str__(self):
        return "My purpose is to make hooman drink water. Oh my god!"

    def discover(self):
        ports = serial.tools.list_ports.comports()

        for port, desc, hwid in sorted(ports):
            if self.hwid in hwid:
                self.serial_port = port
                return True

        return False

    def connect(self):
        if self.serial_port == None:
            raise Exception("walter not discovered")
        self.serial_con = sl.Serial(self.serial_port, 9600)

    def read(self):
        if self.serial_con == None:
            raise Exception("connection to walter not established")
        return int(self.serial_con.readline().decode('utf-8').strip())
