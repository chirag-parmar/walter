
#ifndef BLE_WALTER_H
#define BLE_WALTER_H

/* Standard Includes */
#include <stdint.h>
#include <stdbool.h>

/* SDK Includes */
#include "ble.h"
#include "ble_srv_common.h"

// 65ea905b-cdad-40f4-923e-c5c7abab9c99
#define WALTER_SERVICE_UUID_BASE         {0x99, 0x9C, 0xAB, 0xAB, 0xC7, 0xC5, 0x3E, 0x92, \
                                          0x40, 0xF4, 0xCD, 0xAD, 0x5B, 0x90, 0xEA, 0x65}

#define WALTER_SERVICE_UUID               0x1400
#define WATER_LEVEL_MEASUREMENT_CHAR      0x1401

#define MAX_WLM_LEN                       4

/**@brief Walter Service structure. This contains various status information for the service. */
struct ble_walter_service_s
{
    uint16_t                      service_handle;                 /**< Handle of Walter Service (as provided by the BLE stack). */
    ble_gatts_char_handles_t      wlm_handles;                     /**< Handles related to the Water level measurement Value characteristic. */
    uint16_t                      conn_handle;                    /**< Handle of the current connection (as provided by the BLE stack, is BLE_CONN_HANDLE_INVALID if not in a connection). */
    uint8_t                       uuid_type;
};

// Forward declaration of the ble_walter_t type.
typedef struct ble_walter_service_s ble_walter_service_t;

/**@brief   Macro for defining a ble_cus instance.*/
#define BLE_WALTER_SERVICE_DEF(_name)  static ble_walter_service_t _name;


uint32_t ble_walter_service_init(ble_walter_service_t * p_walter_service);
uint32_t water_level_update(ble_walter_service_t * p_walter_service, long * wlm_sensor_value);

void ble_walter_service_on_ble_evt(ble_evt_t const * p_ble_evt, void * p_context);

#endif
