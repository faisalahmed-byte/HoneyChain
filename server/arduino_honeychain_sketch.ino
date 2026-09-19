// ============================================================================
// HONEY CHAIN IoT - Smart Hive Node Firmware (DHT22 + I2C 16x2 LCD)
// ============================================================================
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Bonezegei_DHT22.h>

// ================= PIN CONFIGURATION =================
#define DHT_PIN 7

// I2C LCD - Standard address: 0x27 (or 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Bonezegei DHT22 instance
Bonezegei_DHT22 dht(DHT_PIN);

// ================= SETUP =================
void setup() {
  Serial.begin(9600); // 9600 Baud for Honey Chain IoT Serial Bridge

  // Start DHT22
  dht.begin();

  // Start I2C LCD
  lcd.init();
  lcd.backlight();

  // Startup splash screen
  lcd.setCursor(0, 0);
  lcd.print("HONEY CHAIN");
  lcd.setCursor(0, 1);
  lcd.print("Smart Hive Node");

  Serial.println("================================");
  Serial.println("HONEY CHAIN - SMART HIVE NODE");
  Serial.println("DHT22 Sensor Initializing...");
  Serial.println("================================");

  delay(2000);

  lcd.clear();
}

// ================= MAIN LOOP =================
void loop() {
  if (dht.getData()) {
    float temperature = dht.getTemperature();
    int humidity = dht.getHumidity();

    // ================= LCD DISPLAY =================
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(temperature, 1);
    lcd.print((char)223); // Degree symbol
    lcd.print("C   ");

    lcd.setCursor(0, 1);
    lcd.print("Hum : ");
    lcd.print(humidity);
    lcd.print("%   ");

    // ================= SERIAL MONITOR / HONEY CHAIN BRIDGE =================
    // Output format parsed by server/arduino_bridge.py:
    Serial.print("Temperature: ");
    Serial.print(temperature, 1);
    Serial.print(" C | Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

  } else {
    // ================= SENSOR ERROR =================
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!");

    lcd.setCursor(0, 1);
    lcd.print("Check DHT22");

    Serial.println("ERROR: Failed to read DHT22 sensor.");
  }

  // DHT22 sampling interval (2 seconds)
  delay(2000);
}
