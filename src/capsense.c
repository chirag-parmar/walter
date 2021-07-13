/*
 CapacitiveSense.h v.04 - Capacitive Sensing Library for 'duino / Wiring
 https://github.com/PaulStoffregen/CapacitiveSensor
 http://www.pjrc.com/teensy/td_libs_CapacitiveSensor.html
 http://playground.arduino.cc/Main/CapacitiveSensor
 Copyright (c) 2009 Paul Bagder  All right reserved.
 Version 05 by Paul Stoffregen - Support non-AVR board: Teensy 3.x, Arduino Due
 Version 04 by Paul Stoffregen - Arduino 1.0 compatibility, issue 146 fix
 vim: set ts=4:
 */
#include <stdint.h>

#include "capsense.h"
#include "nrf_delay.h"
#include "nrf_gpio.h"

#define F_CPU 64000000UL

int sense_one_cycle(sensor_ctx_t *sensor_ctx);

void initialize_sensor(uint32_t send_pin, uint32_t receive_pin, sensor_ctx_t *sensor_ctx) {

	// initialize this instance's variables
    sensor_ctx->send_pin = send_pin;
    sensor_ctx->receive_pin = receive_pin;

	sensor_ctx->error = 1;
	sensor_ctx->loop_timing_factor = 310;		// determined empirically -  a hack

	sensor_ctx->timeout_millis = (2000 * (float)sensor_ctx->loop_timing_factor * (float)F_CPU) / 16000000;

	//configure the pins
	nrf_gpio_cfg_output(sensor_ctx->send_pin);						  // sendpin to OUTPUT
	nrf_gpio_cfg_input(sensor_ctx->receive_pin, NRF_GPIO_PIN_NOPULL); // receivePin to INPUT
	nrf_gpio_pin_clear(sensor_ctx->send_pin);

}

void set_timeout_millis(unsigned long timeout_millis, sensor_ctx_t *sensor_ctx) {
	sensor_ctx->timeout_millis = (timeout_millis * (float)sensor_ctx->loop_timing_factor * (float)F_CPU) / 16000000;  // floats to deal with large numbers
}

long get_sensor_reading(uint8_t samples, sensor_ctx_t *sensor_ctx) {
	sensor_ctx->total = 0;
	if (samples == 0) return 0;
	if (sensor_ctx->error < 0) return -1;                  // bad pin - this appears not to work

	for (uint8_t i = 0; i < samples; i++) {    // loop for samples parameter - simple lowpass filter
		if (sense_one_cycle(sensor_ctx) < 0)  return -2;   // variable over timeout
	}

	return sensor_ctx->total;
}

int sense_one_cycle(sensor_ctx_t *sensor_ctx) {
    // __disable_irq();
	nrf_gpio_pin_clear(sensor_ctx->send_pin);	// sendPin Register low
	nrf_gpio_cfg_input(sensor_ctx->receive_pin, NRF_GPIO_PIN_NOPULL);	// receivePin to input (pullups are off)
	nrf_gpio_cfg_output(sensor_ctx->receive_pin); // receivePin to OUTPUT
    nrf_gpio_pin_clear(sensor_ctx->receive_pin);	// pin is now LOW AND OUTPUT
	nrf_delay_us(10);
	nrf_gpio_cfg_input(sensor_ctx->receive_pin, NRF_GPIO_PIN_NOPULL);	// receivePin to input (pullups are off)
	nrf_gpio_pin_set(sensor_ctx->send_pin);	// sendPin High
    // __enable_irq();

	while ( !nrf_gpio_pin_read(sensor_ctx->receive_pin) && (sensor_ctx->total < sensor_ctx->timeout_millis) ) {  // while receive pin is LOW AND total is positive value
		sensor_ctx->total++;
	}

	if (sensor_ctx->total > sensor_ctx->timeout_millis) {
		return -2;         //  total variable over timeout
	}

	// set receive pin HIGH briefly to charge up fully - because the while loop above will exit when pin is ~ 2.5V
    // __disable_irq();
	nrf_gpio_pin_set(sensor_ctx->receive_pin);
	nrf_gpio_cfg_output(sensor_ctx->receive_pin);  // receivePin to OUTPUT - pin is now HIGH AND OUTPUT
	nrf_gpio_pin_set(sensor_ctx->receive_pin);
	nrf_gpio_cfg_input(sensor_ctx->receive_pin, NRF_GPIO_PIN_NOPULL);	// receivePin to INPUT (pullup is off)
	nrf_gpio_pin_clear(sensor_ctx->send_pin);	// sendPin LOW
    // __enable_irq();

	while ( nrf_gpio_pin_read(sensor_ctx->receive_pin) && (sensor_ctx->total < sensor_ctx->timeout_millis) ) {  // while receive pin is HIGH  AND total is less than timeout
		sensor_ctx->total++;
	}

	if (sensor_ctx->total >= sensor_ctx->timeout_millis) {
		return -2;     // total variable over timeout
	}

    return 1;
}
