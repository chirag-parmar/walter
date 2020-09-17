#include <stdbool.h>
#include <stdint.h>
#include "nrf_delay.h"
#include "nrf_log.h"
#include "nrf_log_ctrl.h"
#include "nrf_log_default_backends.h"
#include "nrf_delay.h"
#include "boards.h"
#include "capsense.h"
/**
 * @brief Function for application main entry.
 */
int main_example(void)
{
    //Initialize logging
    ret_code_t err_code = NRF_LOG_INIT(NULL);
    APP_ERROR_CHECK(err_code);

    //intialize logging backends
    NRF_LOG_DEFAULT_BACKENDS_INIT();

    sensor_ctx_t sensor_ctx;

    initialize_sensor(NRF_GPIO_PIN_MAP(1, 15), NRF_GPIO_PIN_MAP(1, 13), &sensor_ctx);

    /* Configure board. */
    bsp_board_init(BSP_INIT_LEDS);

    long sensor_value = 0;

    /* Toggle LEDs. */
    while (true) {
        sensor_value = get_sensor_reading(30, &sensor_ctx);

        NRF_LOG_INFO("Sensor Value: %ld", sensor_value);
        NRF_LOG_FLUSH();

        // for (int i = 0; i < LEDS_NUMBER; i++) {
        //     bsp_board_led_invert(i);
        //     nrf_delay_ms(500);
        // }

        nrf_delay_ms(250);
    }
}

/**
 *@}
 **/
