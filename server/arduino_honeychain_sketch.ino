#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Bonezegei_DHT22.h>

// ================= PIN CONFIGURATION =================
#define DHT_PIN 7

// I2C LCD
// Common address: 0x27
LiquidCrystal_I2C lcd(0x27, 16, 2);

Bonezegei_DHT22 dht(DHT_PIN);

// ================= SETUP =================
void setup() {

  Serial.begin(9600);

  // Start DHT22
  dht.begin();

  // Start I2C LCD
  lcd.init();
  lcd.backlight();

  // Startup screen
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
    lcd.print((char)223);
    lcd.print("C   ");

    lcd.setCursor(0, 1);
    lcd.print("Hum : ");
    lcd.print(humidity);
    lcd.print("%   ");

    // ================= SERIAL MONITOR =================

    Serial.print("Temperature: ");
    Serial.print(temperature, 1);
    Serial.print(" C | Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

  }

  else {

    // ================= SENSOR ERROR =================

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!");

    lcd.setCursor(0, 1);
    lcd.print("Check DHT22");

    Serial.println("ERROR: Failed to read DHT22 sensor.");
  }

  // DHT22 reading interval
  delay(2000);
}
