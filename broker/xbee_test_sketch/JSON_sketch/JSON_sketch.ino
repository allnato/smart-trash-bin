

#include <SimpleTimer.h>
#include <ArduinoJson.h>
#include <DHT.h>


// Timer Object
SimpleTimer timer;

// PINS
#define DHT_PIN   2
#define DHT_TYPE  DHT11

DHT dht(DHT_PIN, DHT_TYPE);

// Function Protoypes
void sendJSONData();

void setup() {
  Serial.begin(9600);
  dht.begin();
  timer.setInterval(2000, sendJSONSensorData);
}

void loop() {
  timer.run();
}

/**
 * Sends JSON Sensor Data via XBee serial
 */
void sendJSONSensorData() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["trashID"] = 36;
  root["sonarDistance"] = 23;
  root["temperature"] = t;
  root["humidity"] = h;
  root["tiltPos"] = 1;
  root.printTo(Serial);
  Serial.println();
}
