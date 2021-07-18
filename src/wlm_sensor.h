#ifndef WLM_SENSOR_H_
#define WLM_SENSOR_H_

#include <stdint.h>
#include "nrf_gpio.h"

#define OUTPUT_PIN NRF_GPIO_PIN_MAP(1, 15)

/* Analog inputs. */
#define AIN_7                   7
#define AIN_MASK                (1UL << AIN_7) // | (1UL << AIN_1) | (1UL << AIN_1) // just OR each mask

void wlm_sensor_init(void);
uint32_t wlm_sensor_get_reading(void);

#endif