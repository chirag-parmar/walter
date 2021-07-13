
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
    ble_gatts_char_handles_t      wlm_handle;                     /**< Handles related to the Water level measurement Value characteristic. */
    uint16_t                      conn_handle;                    /**< Handle of the current connection (as provided by the BLE stack, is BLE_CONN_HANDLE_INVALID if not in a connection). */
    uint8_t                       uuid_type;
};

// Forward declaration of the ble_walter_t type.
typedef struct ble_walter_service_s ble_walter_service_t;

/**@brief   Macro for defining a ble_cus instance.*/
#define BLE_WALTER_SERVICE_DEF(_name)  static ble_walter_service_t _name;

/**@brief Function for initializing the Walter Service.
 *
 * @param[out]  p_walter    Walter Service structure. This structure will have to be supplied by
 *                          the application. It will be initialized by this function, and will later
 *                          be used to identify this particular service instance.
 *
 * @return      NRF_SUCCESS on successful initialization of service, otherwise an error code.
 */
uint32_t ble_walter_service_init(ble_walter_service_t * p_walter_service);

#endif
