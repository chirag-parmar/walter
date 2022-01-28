# Walter: The Water Butler

> Proof of concept document can be found [here](docs/POC.md)

### Dependencies: *(Tested on MACOS)*

1. [Download](https://www.nordicsemi.com/Software-and-tools/Software/nRF5-SDK/Download) nRF5 SDK
2. [Download](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads) ARM GCC toolchain
4. [Download](https://www.nordicsemi.com/Software-and-Tools/Development-Tools/nRF-Command-Line-Tools/Download#infotabs) nRF5x Command Line Tools.
4. Extract nRF5 SDK and rename the extracted folder to `nrf5-sdk`.
5. Extract GCC ARM toolchain and rename the extracted folder to `arm-toolchain`
6. Extract `nRF5x Command Line Tools` TAR file.
    * Navigate inside the nrf ommand line tools folder and install the Jlink package withing it.
    * Navigate inside the nrf ommand line tools folder and install the `nRF5x Command Line Tools` package withing it.
7. Check installations
    * J-Link *(MAC-OS)*: Check if this path exists `/Applications/SEGGER/JLink`
    * nRF5x Command Line Tools: `nrfjprog -v` must output the version.
8. Export Environment variables to specifying SDK folder path and ARM toolchain path.
    * `export SDK_ROOT=<PATH TO nrf5-sdk/ folder>`
    * `export GNU_INSTALL_ROOT=<PATH TO arm-toolchain/bin/ folder>`

> MAC-OS Complications: The system is going to complain that "the developer cannot be verified" for `arm-none-eabi-gcc`, `cc1`, `as`, `collect2`, `ld`, `liblto_plugin.0.so`, `arm-none-eabi-size`, `arm-none-eabi-objcopy`. Click on `Cancel` and then open Security and Privacy settings and click on `Allow Anyway`. These complains are gonna show one after the another.

### Burning the software:
```bash
make flash
```

### TODO:
* [ ] [IMPORTANT] Debug NRF52840 - doesn't stop advertising at all
* [ ] [IMPORTANT] initialize GPIO only while reading the sensor.
* [ ] [IMPORTANT] Debug app: after refresh or after close and restart of app BLE shows connected but not re4ading notifications - most probably it is the BleManager object that has gone out of scope.
* [ ] README Documentation
  * [ ] NRF softdevice and flashing instructions without debugger and with debugger 
* [ ] Statistical and Analytical
  * [ ] function for analysing a day's worth of data and extracting the num. of bottles drank metric
  * [ ] triggers for interacting with the user
  * [ ] Touch sensing
* [ ] Software
  * [ ] Using NRF52840 Dongle.
    * [x] Port Capcitive Sensor library to nRF
    * [x] Define BLE services and characteristics
    * [ ] Finish battery level indication integration (depends on power supply design)
  * [ ] App Design
    * [x] POC integration with BLE
    * [x] UI Wire Frame
    * [x] UI Design and Integration with BLE
    * [x] run ble recorded in background
    * [x] save data locally - ~~use firebase~~
      * [x] save device info
      * [x] save readings
      * [x] save calibration values
      * [x] save settings
      * [x] save on change
    * [ ] Main screen statistics design
* [ ] Hardware
  * [ ] Sensor fabrication documentation
  * [ ] hardware fabrication documentation
  * [ ] Aluminium or Copper Tape electrodes
  * [x] ~~3D printed case~~ - Going with no case design. who cares about the case anyway. The board is waterproofed
  * [x] Power supply design
    * [x] Coin Cells/ Super Capacitors - Super capacitor can power only for 6 minutes
      * [x] Investigate if we can use coin cells/super capacitors
      * [x] Calculate the usage time per charge and choose an appropriately sized battery
      * [x] Design necessary circuitry for using coin/cell or supercapcitors
      * [x] Fabricate and Integrate circuitry and battery with nrf52840

### Power Caclulations for Supercapacitor

Current draw - 11uA for 8 s and 3 ma for 2s => ~600uA (average)
Power Consumption at 3.6v = 3.6v * 600uA => 2.16mW

Energy stored in the capacitor = 1/2*C*deltaV*deltaV = 0.5 * 1F * (3.6v- 2v)^2 = 1.28J Joules

Energy = Power * Time => Time = Energy/Power => 1.28J/2.16mW => 592s => ~10minutes

**Decision:** Use CR2032 or better rechargeable CR2032

### Future Ideas:

* [ ] onboarding flow
* [ ] social - share water usage statistics with a friend, challenges etc.
* [ ] better UI