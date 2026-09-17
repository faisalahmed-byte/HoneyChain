#include <Bonezegei_DHT22.h>
#include <LiquidCrystal.h>

// Pin Configuration (matching your hardware wiring)
Bonezegei_DHT22 dht(7);                // DHT22 data pin = Pin 7
LiquidCrystal lcd(12, 11, 5, 4, 3, 2); // RS, EN, D4, D5, D6, D7

void setup() {
  Serial.begin(9600); // 9600 Baud communication with Honey Chain
  lcd.begin(16, 2);
  dht.begin();

  // Startup splash screen
  lcd.setCursor(0, 0);
  lcd.print("HONEY CHAIN IoT");
  lcd.setCursor(0, 1);
  lcd.print("Smart Hive Node");
  
  Serial.println("HONEY CHAIN - Smart Hive Node Initializing...");
  delay(2000);
  lcd.clear();
}

void loop() {
  if (dht.getData()) {
    float temp = dht.getTemperature(); // Celsius from DHT22
    int hum = dht.getHumidity();       // Humidity % from DHT22

    // Apply your calibration offsets:
    float finalTemp = temp + 23.0; // Your tested temperature
    int finalHum = hum + 50;        // Your tested humidity

    // 1. Display on your physical 16x2 LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(finalTemp, 1);
    lcd.print((char)223); // degree symbol
    lcd.print("C");

    lcd.setCursor(0, 1);
    lcd.print("Hum:  ");
    lcd.print(finalHum);
    lcd.print(" %");

    // 2. Output to USB Serial for Honey Chain Website & Supabase
    Serial.print("Temperature: ");
    Serial.print(finalTemp, 1);
    Serial.print(" C   Humidity: ");
    Serial.print(finalHum);
    Serial.println(" %");

  } else {
    // Sensor reading failed
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!   ");
    lcd.setCursor(0, 1);
    lcd.print("Check DHT22 pin ");
    Serial.println("Sensor Error! Failed to read from DHT22.");
  }

  delay(2000); // Wait 2 seconds before next reading
}
