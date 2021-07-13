/* Copyright (c) 2015 Nordic Semiconductor. All Rights Reserved.
 *
 * The information contained herein is property of Nordic Semiconductor ASA.
 * Terms and conditions of usage are described in detail in NORDIC
 * SEMICONDUCTOR STANDARD SOFTWARE LICENSE AGREEMENT.
 *
 * Licensees are granted free, non-transferable use of the information. NO
 * WARRANTY of ANY KIND is provided. This heading must NOT be removed from
 * the file.
 *
 */

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include "nrf_delay.h"
#include "nrf_gpio.h"
#include "nrf_gpiote.h"
#include "boards.h"

#include "capsense.h"
#include "wlm_sensor.h"

#define NUM_CHANNELS 1

static capsense_channel_t m_capsense_array[NUM_CHANNELS]; 

void wlm_sensor_init(void) {
    capsense_config_t capsense_config[] = {{ANA_AIN2_P01, 14}};
    nrf_capsense_init(m_capsense_array, capsense_config, NUM_CHANNELS);                                           
}

uint32_t wlm_sensor_get_reading(void) {
    nrf_capsense_sample();
    return m_capsense_array[0].value;
}