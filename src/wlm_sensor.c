#include "nrf_drv_csense.h"
#include "wlm_sensor.h"
#include <stdint.h>

static uint16_t sensor_value;

void csense_handler(nrf_drv_csense_evt_t * p_evt)
{ 
    
    switch(p_evt->analog_channel) {
        case AIN_7:
            sensor_value = p_evt->read_value;
            break;
        default:
            break;
    }
}

void wlm_sensor_init(void) {
    ret_code_t err_code;

    nrf_drv_csense_config_t csense_config = {0};
    csense_config.output_pin = OUTPUT_PIN;

    err_code = nrf_drv_csense_init(&csense_config, csense_handler);
    APP_ERROR_CHECK(err_code);

    nrf_drv_csense_channels_enable(AIN_MASK);
}

uint32_t wlm_sensor_get_reading() {
    ret_code_t err_code;

    err_code = nrf_drv_csense_sample();
    APP_ERROR_CHECK(err_code);

    return (uint32_t)sensor_value;
}
