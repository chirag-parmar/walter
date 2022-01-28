#ifndef CAPSENSE_H__
#define CAPSENSE_H__

typedef struct SENSOR_CTX {
  int error;
  unsigned int   loop_timing_factor;
  unsigned long  timeout_millis;
  uint32_t send_pin;
  uint32_t receive_pin;
  unsigned long total;
} sensor_ctx_t;

long get_sensor_reading(uint8_t samples, sensor_ctx_t *sensor_ctx);
void set_timeout_millis(unsigned long timeout_millis, sensor_ctx_t *sensor_ctx);
void initialize_sensor(uint32_t send_pin, uint32_t receive_pin, sensor_ctx_t *sensor_ctx);
void uninitialize_sensor(sensor_ctx_t *sensor_ctx);

#endif
