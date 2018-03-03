#include <DHT.h>
#include <ArduinoJson.h>
#include "SoftwareSerial.h"

#define DHT_TYPE DHT11
#define DHT_PIN 2

// Initialize DHT
DHT dht(DHT_PIN, DHT_TYPE);
SoftwareSerial XBee(4,3);

void setup() {
  Serial.begin(9600);
  XBee.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);
  
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT Sensor");
    return;
  }

  Serial.print("Humidity: "); Serial.print(h); Serial.print("%\t");
  Serial.print("Temperature: "); Serial.print(t); Serial.println("*C");

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["temperature"] = t;
  root["humidity"] = h;
  root.printTo(XBee);
}
