

#include <SimpleTimer.h>
#include <ArduinoJson.h>
#include <MFRC522.h>
#include <NewPing.h>
#include <DHT.h>
#include <SPI.h>


// Timer Object
SimpleTimer timer;

// PINS
#define TRIG_PIN  2
#define ECHO_PIN  3
#define DHT_PIN   4
#define TILT_S1   5
#define TILT_S2   6
#define RST_PIN   9
#define SDA_PIN   10

// CONST VAR 
#define TRASH_ID  01
#define DIST_MAX  35
#define DHT_TYPE  DHT11

// Initialize Sensors
NewPing sonar(TRIG_PIN, ECHO_PIN, DIST_MAX);
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
DHT dht(DHT_PIN, DHT_TYPE);

// Array that will store NUID of RFID
byte nuidPICC[4];

// Function Protoypes
void sendJSONData();
double getSonarDistance();
int getTiltPos();
bool readCard();
void printHex();

void setup() {
  Serial.begin(9600);
  pinMode(TILT_S1, INPUT);
  pinMode(TILT_S2, INPUT);
  dht.begin();
  SPI.begin();
  rfid.PCD_Init();
  timer.setInterval(2000, sendJSONSensorData);
}

void loop() {
  timer.run();
}

/**
 * Sends JSON Sensor Data via XBee serial
 */
void sendJSONSensorData() {
  float sonarDistance = getSonarDistance();
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int tiltPos = getTiltPos();
  
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["trashID"] = TRASH_ID;
  root["sonarDistance"] = sonarDistance;
  root["temperature"] = t;
  root["humidity"] = h;
  root["tiltPos"] = tiltPos;
  root.prettyPrintTo(Serial);
}

/**
 * Sends JSON RFID Data via XBee Serial
 */
void sendJSONRfidData() {
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["trashID"] = TRASH_ID;
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

/**
 * Read RFID Card
 */
bool readCard() {
  // Look for new cards
  if ( ! rfid.PICC_IsNewCardPresent())
    return false;

  // Verify if the NUID has been readed
  if ( ! rfid.PICC_ReadCardSerial()) {
    Serial.println("[ERROR]: Failed verify NUID of card.");
    return false;
  }


  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
      piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
      piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("[ERROR]: Tag is not of type MIFARE Classic."));
    return false;
  }

  // Store NUID into nuidPICC array
  for (byte i = 0; i < 4; i++) {
    nuidPICC[i] = rfid.uid.uidByte[i];
  }

  return true;
}

/**
   Helper routine to dump a byte array as hex values to Serial.
*/
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}

