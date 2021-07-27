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
* [ ] README Documentation
  * [ ] NRF softdevice and flashing instructions without debugger and with debugger 
* [ ] Statistical and Analytical
  * [ ] function for analysing a day's worth of data and extracting the num. of bottles drank metric
  * [ ] triggers for interacting with the user
  * [ ] Touch sensing
* [ ] Software
  * [ ] Using NRF52840 Dongle to eliminate communication using uart scripts
    * [x] Port Capcitive Sensor library to nRF
    * [x] Define BLE services and characteristics
    * [ ] Finish battery level indication integration (depends on power supply design)
  * [x] App Design
    * [x] POC integration with BLE
    * [x] UI Wire Frame
    * [x] UI Design and Integration with BLE
    * [ ] run ble recorded in background
    * [ ] save data locally
* [ ] Hardware
  * [ ] 3D printed case
  * [ ] Aluminium or Copper Tape electrodes
  * [ ] Power supply design
    * [ ] Coin Cells/ Super Capacitors
      * [ ] Investigate if we can use coin cells/super capacitors
      * [ ] Calculate the usage time per charge and choose an appropriately sized battery
      * [ ] Design necessary circuitry for using coin/cell or supercapcitors
      * [ ] Fabricate and Integrate circuitry and battery with nrf52840

### Future Ideas: