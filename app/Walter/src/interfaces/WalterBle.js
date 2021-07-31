

import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"

class WalterBle {

    constructor() {
        this.id = null
        this.name = null

        BleManager.start({showAlert: false})

        this.handlerDiscover = bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            this.handleDiscoverPeripheral
        )
    
        this.handlerStop = bleManagerEmitter.addListener(
            'BleManagerStopScan',
            this.handleStopScan
        )

        this.handlerNotify = bleManagerEmitter.addListener(
            "BleManagerDidUpdateValueForCharacteristic",
            this.handleNotifications
        )
    }

    scan() {
        console.log("Scanning")
        BleManager.scan([], 5, true)
                .then(() => {
                    console.log("scanning Started")
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "scanning", value: null})
                })
                .catch((err) => console.log(err))
    }

    connect() {
        console.log("Attempting Connection")
        BleManager.connect(this.id)
                .then(() => {
                    console.log("Connected to " + this.name)
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "connected", value: null})
                })
                .catch((err) => console.log(err))
    }

    disconnect() {
        BleManager.disconnect(this.id)
                .then(() => {
                    console.log("Disconnected from " + this.name)
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "disconnected", value: null})
                })
                .catch((err) => console.log(err))
    }

    handleDiscoverPeripheral = (peripheral) => {
        if (peripheral.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
            this.id = peripheral.id
            this.name = peripheral.name

            DeviceEventEmitter.emit('WalterBleEvent', {event: "found", value: null})
        }
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped. Devices: ', this.name)
        DeviceEventEmitter.emit('WalterBleEvent', {event: "scanned", value: null})
    }

    handleNotifications = ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const buf = Buffer.from(value)
        const waterLevel = buf.readUInt32LE(0)

        DeviceEventEmitter.emit('WalterBleEvent', {event: "value", value: waterLevel})
    }

    switchOnNotify() {
        BleManager.retrieveServices(this.id)
            .then((peripheralInfo) => {
                if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                    BleManager.startNotification(this.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
                        .then(() => {
                            console.log("Notification started")
                            DeviceEventEmitter.emit('WalterBleEvent', {event: "notifyon", value: null})
                        })
                        .catch((error) => console.log(error))
                }
            })
            .catch((err) => console.log(err))
    }

    switchOffNotify() {
        BleManager.startNotification(this.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
            .then(() => {
                console.log("Notification stopped")
                DeviceEventEmitter.emit('WalterBleEvent', {event: "notifyoff", value: null})
            })
            .catch((error) => console.log(error))
    }

    bond() {
        BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
            var bondFound = false;

            for(const peripheral of bondedPeripheralsArray) {
                if (peripheral.id == this.id) {
                    console.log("Already Bonded to " + this.name)
                    
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "bonded", value: null})
                    
                    bondFound = true
                    break
                }
            }

            if (!bondFound) {
                BleManager.createBond(this.id)
                    .then(() => {
                        console.log("Bonded to " + this.name)
                        DeviceEventEmitter.emit('WalterBleEvent', {event: "bonded", value: null})
                    })
                    .catch((err) => console.log(err))
            }
        });
    }

    checkConnection() {
        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            console.log(peripheralsArray)
            for (const peripheral of peripheralsArray) {
                BleManager.retrieveServices(peripheral.id)
                    .then((peripheralInfo) => {
                        if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                            console.log("Already Connected to " + peripheralInfo.advertising.localName)

                            this.id = peripheral.id
                            this.name = peripheralInfo.advertising.localName

                            //emit event "found" and "connected"
                            DeviceEventEmitter.emit('WalterBleEvent', {event: "found", value: null})
                            DeviceEventEmitter.emit('WalterBleEvent', {event: "connected", value: null})
                        }
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

}

export var WalterBleInstance = new WalterBle()