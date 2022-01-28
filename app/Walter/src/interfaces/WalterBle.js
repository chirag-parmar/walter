

import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"
const WALTER_CHARACTERISITIC_UUID_FULL = "65ea1401-adcd-f440-923e-c5c7abab9c99"

class WalterBle {

    constructor() {

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
        BleManager.scan([], 5, true)
                .then(() => {
                    console.log("scanning Started")
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "scanning", value: null})
                })
                .catch((err) => console.log(err))
    }

    connect(peripheral) {
        BleManager.connect(peripheral.id)
                .then(() => {
                    console.log("Connected to " + peripheral.name)
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "connected", value: null})
                })
                .catch((err) => console.log(err))
    }

    disconnect(peripheral) {
        BleManager.disconnect(peripheral.id)
                .then(() => {
                    console.log("Disconnected from " + peripheral.name)
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "disconnected", value: null})
                })
                .catch((err) => console.log(err))
    }

    handleDiscoverPeripheral = (peripheral) => {
        console.log(peripheral.name)
        if (peripheral.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {

            console.log("Found " + peripheral.name + " - " + peripheral.id)
            DeviceEventEmitter.emit('WalterBleEvent', {event: "found", value: {id: peripheral.id, name: peripheral.name}})
        }
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped')
        DeviceEventEmitter.emit('WalterBleEvent', {event: "scanned", value: null})
    }

    handleNotifications = ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const buf = Buffer.from(value)
        const waterLevel = buf.readUInt32LE(0)

        DeviceEventEmitter.emit('WalterBleEvent', {event: "value", value: waterLevel})
    }

    switchOnNotify(peripheral) {
        BleManager.retrieveServices(peripheral.id)
            .then((peripheralInfo) => {
                if (peripheralInfo.id == peripheral.id) {
                    BleManager.startNotification(peripheral.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
                        .then(() => {
                            console.log("Notification started")
                            DeviceEventEmitter.emit('WalterBleEvent', {event: "notifyon", value: null})
                        })
                        .catch((error) => console.log(error))
                }
            })
            .catch((err) => console.log(err))
    }

    switchOffNotify(peripheral) {
        BleManager.stopNotification(peripheral.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
            .then(() => {
                console.log("Notification stopped")
                DeviceEventEmitter.emit('WalterBleEvent', {event: "notifyoff", value: null})
            })
            .catch((error) => console.log(error))
    }

    bond(peripheral) {
        BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
            var bondFound = false;

            for(const _peripheral of bondedPeripheralsArray) {
                if (_peripheral.id == peripheral.id) {
                    console.log("Already Bonded to " + peripheral.name)
                    
                    DeviceEventEmitter.emit('WalterBleEvent', {event: "bonded", value: null})
                    
                    bondFound = true
                    break
                }
            }

            if (!bondFound) {
                BleManager.createBond(peripheral.id)
                    .then(() => {
                        console.log("Bonded to " + peripheral.name)
                        DeviceEventEmitter.emit('WalterBleEvent', {event: "bonded", value: null})
                    })
                    .catch((err) => console.log(err))
            }
        });
    }

    checkConnection(my_peripheral) {

        return new Promise((resolve, _) => {
            BleManager.getConnectedPeripherals([WALTER_SERVICE_UUID]).then((peripheralsArray) => {
                    if(peripheralsArray && peripheralsArray.length > 0) {
                        for (const peripheral of peripheralsArray) {
                            if (peripheral.id == my_peripheral.id) {
                                resolve(true)
                            }
                        }
                    }
                    
                    resolve(false)
                }).catch((e) => {
                    resolve(false)
                })
        })
    }

}

export var WalterBleInstance = new WalterBle()