// ============================================================================
// HONEY CHAIN IoT - Smart Hive Node Firmware (DHT11 + 16x2 Parallel LCD)
// ============================================================================

// OPTION A: Using Bonezegei DHT11 library (default)
#include <Bonezegei_DHT11.h>
#include <LiquidCrystal.h>

// DHT11 Data Pin connected to Arduino Digital Pin 7
Bonezegei_DHT11 dht(7);

// 16x2 Parallel LCD Pinout: RS=Pin 12, EN=Pin 11, D4=Pin 5, D5=Pin 4, D6=Pin 3, D7=Pin 2
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

/*
// ----------------------------------------------------------------------------
// OPTION B: If using standard Adafruit "DHT sensor library", uncomment this block
// and comment out Option A above:
// ----------------------------------------------------------------------------
#include <DHT.h>
#include <LiquidCrystal.h>
#define DHTPIN 7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
// ----------------------------------------------------------------------------
*/

void setup() {
  Serial.begin(9600); // 9600 Baud communication with Honey Chain bridge
  lcd.begin(16, 2);
  dht.begin();

  // Startup splash screen
  lcd.setCursor(0, 0);
  lcd.print("HONEY CHAIN IoT");
  lcd.setCursor(0, 1);
  lcd.print("Smart Hive Node ");
  
  Serial.println("================================================");
  Serial.println("HONEY CHAIN - Smart Hive Node Initializing...");
  Serial.println("DHT11 Sensor on Pin 7 | LCD (12, 11, 5, 4, 3, 2)");
  Serial.println("================================================");
  delay(2000);
  lcd.clear();
}

void loop() {
  // Option A (Bonezegei):
  if (dht.getData()) {
    float temp = dht.getTemperature(); // Celsius
    int hum = dht.getHumidity();       // Relative Humidity %

    /*
    // Option B (Adafruit DHT):
    float temp = dht.readTemperature();
    int hum = (int)dht.readHumidity();
    if (!isnan(temp) && !isnan(hum)) {
    */

    // Calibration offset (Adjust only if your DHT11 requires fine-tuning):
    float finalTemp = temp; // e.g. temp + 0.0
    int finalHum = hum;     // e.g. hum + 0

    // 1. Display on your physical 16x2 LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(finalTemp, 1);
    lcd.print((char)223); // degree symbol (°)
    lcd.print("C");

    lcd.setCursor(0, 1);
    lcd.print("Hum:  ");
    lcd.print(finalHum);
    lcd.print(" %");

    // 2. Output to USB Serial for Honey Chain Python Bridge (arduino_bridge.py)
    // Synchronizes with both local SQLite backend and Supabase Cloud / Vercel
    Serial.print("Temperature: ");
    Serial.print(finalTemp, 1);
    Serial.print(" C   Humidity: ");
    Serial.print(finalHum);
    Serial.println(" %");

  } else {
    // Sensor reading failed
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!   ");
    lcd.setCursor(0, 1);
    lcd.print("Check DHT11 pin ");
    Serial.println("Sensor Error! Failed to read from DHT11.");
  }

  delay(2000); // DHT11 sampling rate: read every 2 seconds
}
