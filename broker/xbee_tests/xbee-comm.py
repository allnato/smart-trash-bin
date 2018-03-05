import serial
import time
serport = serial.Serial('COM8', 9600, 
                        timeout=2)
while True:
    temp=serport.read(200)
    print temp