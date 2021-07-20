#include <stdint.h>
#include "nrf_gpio.h"

#include "capsense.h"
#include "wlm_sensor.h"

#define NUM_CHANNELS 1

static capsense_channel_t m_capsense_array[NUM_CHANNELS]; 

void wlm_sensor_init(void) {
    capsense_config_t capsense_config[] = {{AIN_7, OUTPUT_PIN}};
    nrf_capsense_init(m_capsense_array, capsense_config, NUM_CHANNELS);                                           
}

uint32_t wlm_sensor_get_reading(void) {
    nrf_capsense_sample();
    return m_capsense_array[0].value;
}