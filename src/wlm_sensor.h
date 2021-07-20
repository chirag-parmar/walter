#ifndef WLM_SENSOR_H_
#define WLM_SENSOR_H_

#include <stdint.h>
#include "nrf_gpio.h"

#define OUTPUT_PIN                 NRF_GPIO_PIN_MAP(0, 15)

/* Analog inputs. */
#define AIN_0                       NRF_GPIO_PIN_MAP(0, 2)
#define AIN_1                       NRF_GPIO_PIN_MAP(0, 3)
#define AIN_2                       NRF_GPIO_PIN_MAP(0, 4)
#define AIN_3                       NRF_GPIO_PIN_MAP(0, 5)
#define AIN_4                       NRF_GPIO_PIN_MAP(0, 28)
#define AIN_5                       NRF_GPIO_PIN_MAP(0, 29)
#define AIN_6                       NRF_GPIO_PIN_MAP(0, 30)
#define AIN_7                       NRF_GPIO_PIN_MAP(0, 31)

void wlm_sensor_init(void);
uint32_t wlm_sensor_get_reading(void);

#endif