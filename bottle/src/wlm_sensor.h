#ifndef WLM_SENSOR_H_
#define WLM_SENSOR_H_

#include <stdint.h>

void wlm_sensor_init(void);
void wlm_sensor_uninit(void);
uint32_t wlm_sensor_get_reading(void);

#endif