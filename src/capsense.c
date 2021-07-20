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
 
#include "capsense.h"
#include "nrf.h"
#include "nrf_gpio.h"
#include "nrf_delay.h"

static uint32_t m_channel_num;
static capsense_channel_t *m_capsense_channel_list;

static volatile uint32_t channel_current;

void nrf_capsense_init(capsense_channel_t *channel_array, capsense_config_t *config_array, uint32_t channel_num)
{
    CAPSENSE_TIMER->PRESCALER = 0;
    CAPSENSE_TIMER->BITMODE = TIMER_BITMODE_BITMODE_16Bit << TIMER_BITMODE_BITMODE_Pos;
    CAPSENSE_TIMER->CC[1] = 1000*16;
    CAPSENSE_TIMER->SHORTS = TIMER_SHORTS_COMPARE1_CLEAR_Msk | TIMER_SHORTS_COMPARE1_STOP_Msk;
    CAPSENSE_TIMER->INTENSET = TIMER_INTENSET_COMPARE1_Msk;
    CAPSENSE_TIMER->TASKS_CLEAR = 1;
    
    NRF_LPCOMP->REFSEL = LPCOMP_REFSEL_REFSEL_SupplyFourEighthsPrescaling << LPCOMP_REFSEL_REFSEL_Pos;
    NRF_LPCOMP->ANADETECT = LPCOMP_ANADETECT_ANADETECT_Up << LPCOMP_ANADETECT_ANADETECT_Pos;
    NRF_LPCOMP->SHORTS = LPCOMP_SHORTS_UP_STOP_Msk;
    NRF_LPCOMP->INTENSET = LPCOMP_INTENSET_UP_Msk;
    NRF_LPCOMP->ENABLE = LPCOMP_ENABLE_ENABLE_Enabled << LPCOMP_ENABLE_ENABLE_Pos;
   
    m_capsense_channel_list = channel_array;
    m_channel_num = channel_num;
    for(uint32_t ch = 0; ch < channel_num; ch++)
    {
        nrf_gpio_cfg_output(config_array[ch].output);
        nrf_gpio_cfg_input(config_array[ch].input, NRF_GPIO_PIN_NOPULL);
    
        channel_array[ch].ana_pin = config_array[ch].input;
        channel_array[ch].out_pin = config_array[ch].output;
        channel_array[ch].rolling_average    = 400 * ROLLING_AVG_FACTOR;
        channel_array[ch].average            = 0xFFFF;
        channel_array[ch].average_counter    = channel_array[ch].average_int = 0;
        channel_array[ch].value_debouncemask = 0;
        channel_array[ch].val_max            = 0;
        channel_array[ch].val_min            = 0xFFFF;
        channel_array[ch].ch_num             = ch;    
    }
    NRF_PPI->CH[CAPSENSE_PPI_CH0].EEP = (uint32_t)&NRF_LPCOMP->EVENTS_UP;
    NRF_PPI->CH[CAPSENSE_PPI_CH0].TEP = (uint32_t)&CAPSENSE_TIMER->TASKS_CAPTURE[0];
    NRF_PPI->CHENSET = 1 << CAPSENSE_PPI_CH0;
    
    NRF_PPI->CH[CAPSENSE_PPI_CH1].EEP = (uint32_t)&NRF_LPCOMP->EVENTS_UP;
    NRF_PPI->CH[CAPSENSE_PPI_CH1].TEP = (uint32_t)&CAPSENSE_TIMER->TASKS_STOP;
    NRF_PPI->CHENSET = 1 << CAPSENSE_PPI_CH1;
    
    NVIC_SetPriority(CAPSENSE_TIMER_IRQ, 3);
    NVIC_EnableIRQ(CAPSENSE_TIMER_IRQ);
    NVIC_SetPriority(LPCOMP_IRQn, 3);
    NVIC_EnableIRQ(LPCOMP_IRQn);
}

static void sampling_initiate()
{
    NRF_LPCOMP->PSEL = m_capsense_channel_list[channel_current].ana_pin << LPCOMP_PSEL_PSEL_Pos;
    NRF_LPCOMP->TASKS_START = 1;
    CAPSENSE_TIMER->TASKS_CLEAR = 1;
    CAPSENSE_TIMER->TASKS_START = 1;
    nrf_gpio_pin_set(m_capsense_channel_list[channel_current].out_pin);
}

static void sampling_finalize(uint32_t new_sample)
{
    nrf_gpio_pin_clear(m_capsense_channel_list[channel_current].out_pin); 

    if(channel_current < (m_channel_num-1))
    {
        channel_current++;
        sampling_initiate();
        m_capsense_channel_list[channel_current-1].value = new_sample;
    }
    else
    {
        m_capsense_channel_list[channel_current].value = new_sample;
    }   
}
    
void nrf_capsense_sample(void)
{
    channel_current = 0;
    sampling_initiate();
}

void LPCOMP_IRQHandler(void)
{
    if(NRF_LPCOMP->EVENTS_UP)
    {
        NRF_LPCOMP->EVENTS_UP = 0;
        CAPSENSE_TIMER->EVENTS_COMPARE[1] = 0;
        
        sampling_finalize(CAPSENSE_TIMER->CC[0]);
    }
}

void CAPSENSE_TIMER_IRQHandler(void)
{
    if(CAPSENSE_TIMER->EVENTS_COMPARE[1])
    {
        CAPSENSE_TIMER->EVENTS_COMPARE[1] = 0;
        NRF_LPCOMP->EVENTS_UP = 0;
        
        sampling_finalize(CAPSENSE_TIMER->CC[1]);
    }
}