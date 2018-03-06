

#include <SimpleTimer.h>
#include <ArduinoJson.h>
#include "SoftwareSerial.h"

SoftwareSerial XBee(2,3);
// Timer Object
SimpleTimer timer;


// Function Protoypes
void sendJSONData();

void setup() {
  Serial.begin(9600);
  XBee.begin(9600);
  timer.setInterval(2000, sendJSONSensorData);
}

void loop() {
  timer.run();
}

/**
 * Sends JSON Sensor Data via XBee serial
 */
void sendJSONSensorData() {
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["trashID"] = 36;
  root["sonarDistance"] = 23;
  root["temperature"] = 23;
  root["humidity"] = 43;
  root["tiltPos"] = 1;
  root.printTo(XBee);
  XBee.println();
}
