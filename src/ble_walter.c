/* Standard Includes */
#include <string.h>

/* SDK Includes */
#include "sdk_common.h"
#include "ble_srv_common.h"
#include "nrf_gpio.h"
#include "boards.h"
#include "nrf_log.h"
#include "app_error.h"

/* Project Includes */
#include "ble_walter.h"

uint32_t ble_wlm_char_init(ble_walter_service_t * p_walter_service) {

    uint32_t              err_code;

    // Add water level measurement characteristic
    ble_add_char_params_t add_char_params;
    memset(&add_char_params, 0, sizeof(add_char_params));

    add_char_params.uuid              = WATER_LEVEL_MEASUREMENT_CHAR;
    add_char_params.max_len           = MAX_WLM_LEN;
    add_char_params.init_len          = MAX_WLM_LEN;
    add_char_params.p_init_value      = 0x00000000;
    add_char_params.is_var_len        = false;
    add_char_params.char_props.notify = 1;
    add_char_params.read_access       = SEC_OPEN;
    add_char_params.write_access      = SEC_NO_ACCESS;
    add_char_params.cccd_write_access = SEC_OPEN;

    err_code = characteristic_add(p_walter_service->service_handle, 
                                  &add_char_params, 
                                  &(p_walter_service->wlm_handles));

    return err_code;
}

uint32_t ble_walter_service_init(ble_walter_service_t * p_walter_service) {
    
    VERIFY_PARAM_NOT_NULL(p_walter_service);

    uint32_t              err_code;
    ble_uuid_t            ble_uuid;

    // Initialize service structure
    p_walter_service->conn_handle               = BLE_CONN_HANDLE_INVALID;

    // Add Walter Service UUID
    ble_uuid128_t base_uuid = {WALTER_SERVICE_UUID_BASE};
    err_code = sd_ble_uuid_vs_add(&base_uuid, &p_walter_service->uuid_type);
    VERIFY_SUCCESS(err_code);

    ble_uuid.type = p_walter_service->uuid_type;
    ble_uuid.uuid = WALTER_SERVICE_UUID;

    // Add the Walter Service
    err_code = sd_ble_gatts_service_add(BLE_GATTS_SRVC_TYPE_PRIMARY, 
                                        &ble_uuid, 
                                        &p_walter_service->service_handle);

    if (err_code != NRF_SUCCESS) return err_code;

    err_code = ble_wlm_char_init(p_walter_service);

    return err_code;
}

uint32_t water_level_update(ble_walter_service_t * p_walter_service, uint32_t * wlm_sensor_value) {

    uint32_t err_code;

    if (p_walter_service->conn_handle != BLE_CONN_HANDLE_INVALID) {
        uint16_t               len;
        uint16_t               hvx_len;
        ble_gatts_hvx_params_t hvx_params;

        memset(&hvx_params, 0, sizeof(hvx_params));

        len = 4;
        hvx_len = len;

        hvx_params.handle = p_walter_service->wlm_handles.value_handle;
        hvx_params.type   = BLE_GATT_HVX_NOTIFICATION;
        hvx_params.offset = 0;
        hvx_params.p_len  = &hvx_len;
        hvx_params.p_data = (uint8_t*)wlm_sensor_value;  

        sd_ble_gatts_hvx(p_walter_service->conn_handle, &hvx_params);
        
        if ((err_code == NRF_SUCCESS) && (hvx_len != len)) err_code = NRF_ERROR_DATA_SIZE;
    
    } else {
        err_code = NRF_ERROR_INVALID_STATE;
    }

    return err_code;
}

void ble_walter_service_on_ble_evt(ble_evt_t const * p_ble_evt, void * p_context) {

    ble_walter_service_t * p_walter_service = (ble_walter_service_t *)p_context;

    switch (p_ble_evt->header.evt_id) {
        case BLE_GAP_EVT_CONNECTED:
            p_walter_service->conn_handle = p_ble_evt->evt.gap_evt.conn_handle;
            break;
        case BLE_GAP_EVT_DISCONNECTED:
            p_walter_service->conn_handle = BLE_CONN_HANDLE_INVALID;
            break;
        default:
            // No implementation needed.
            break;
    }
}
