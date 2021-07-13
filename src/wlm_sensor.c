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
#include "nrf_delay.h"
#include "boards.h"
#include "capsense.h"

#include "capsense.h"
#include "wlm_sensor.h"

static sensor_ctx_t sensor_ctx;

void wlm_sensor_init(void) {
    initialize_sensor(NRF_GPIO_PIN_MAP(1, 15), NRF_GPIO_PIN_MAP(1, 13), &sensor_ctx);                                          
}

uint32_t wlm_sensor_get_reading(void) {
    long sensor_value = get_sensor_reading(30, &sensor_ctx);
    return (uint32_t) sensor_value;
}