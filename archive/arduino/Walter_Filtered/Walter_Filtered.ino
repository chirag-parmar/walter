#include <CapacitiveSensor.h>

CapacitiveSensor   cs_4_2 = CapacitiveSensor(4,7);        // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired

const long n = 10;
long buff[n];
long pos = 0;

void setup() {
   cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
   Serial.begin(9600);
}

void loop() {
  long value = cs_4_2.capacitiveSensorRaw(30);
  Serial.println(moving_average_filter(value));                  // print sensor output 1
    
  delay(100);                             // arbitrary delay to limit data to serial port 
}

long moving_average_filter(long new_value) {
  buff[pos%n] = new_value;

  long sum = 0;

  for(int i = 0; i < n; i++) {
    sum += buff[i];
  }

  if (pos < n) pos++;
  else pos = 0;

  return(sum/n);
}
