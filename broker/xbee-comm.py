import serial
import time
serport=serial.Serial('COM6', 9600, timeout=1000)
while True:
    temp=serport.readline().decode()
    print("Temp: {}").format(temp[0:5])
    time.sleep (1)