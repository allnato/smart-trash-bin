#include <SimpleTimer.h>
#include <ArduinoJson.h>
#include <NewPing.h>
#include <DHT.h>

// Timer Object
SimpleTimer timer;

// PINS
#define TRIG_PIN  2
#define ECHO_PIN  3
#define DHT_PIN   4
#define TILT_S1   5
#define TILT_S2   6
// CONST VAR 
#define DIST_MAX 35
#define DHT_TYPE DHT11

// Initialize Sensors
NewPing sonar(TRIG_PIN, ECHO_PIN, DIST_MAX);
DHT dht(DHT_PIN, DHT_TYPE);


// Function Protoypes
void sendJSONData();
double getSonarDistance();
int getTiltPos();

void setup() {
  Serial.begin(9600);
  pinMode(TILT_S1, INPUT);
  pinMode(TILT_S2, INPUT);
  dht.begin();
  timer.setInterval(2000, sendJSONData);
}

void loop() {
  timer.run();
}



/**
 * Sends JSON Data via XBee serial
 */
void sendJSONData() {
  float sonarDistance = getSonarDistance();
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int tiltPos = getTiltPos();
  
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["sonarDistance"] = sonarDistance;
  root["temperature"] = t;
  root["humidity"] = h;
  root["tiltPos"] = tiltPos;
  root.prettyPrintTo(Serial);
}

/**
 * Fetch the Sonar Distance
 */
double getSonarDistance() {
  long sonarTimeDelay = sonar.ping_median(5);
  double sonarDistance = (sonarTimeDelay / 2) / 29.154;
  return sonarDistance;
}

/**
 * Fetch Tile Posisitoin
 */
int getTiltPos(){
  int S1 = digitalRead(TILT_S1);
  int S2 = digitalRead(TILT_S2);
  return (S1 << 1) | S2; //BITWISE MATH
}

