

import { NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"

export const WalterBleEvent = {
    SCANNING: 0,
    SCANNED: 1,
    CONNECTED: 2,
    DISCONNECTED: 3,
    BONDED: 4,
    NOTIFYON: 5,
    NOTIFYOFF: 6,
    FOUND: 7,
    VALUE: 8
}

export class WalterBle {

    constructor(handler) {
        this.id = null
        this.name = null
        this.handler = handler

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
                    this.handler(WalterBleEvent.SCANNING)
                })
                .catch((err) => console.log(err))
    }

    connect() {
        BleManager.connect(this.id)
                .then(() => {
                    console.log("Connected to " + this.name)
                    this.handler(WalterBleEvent.CONNECTED)
                })
                .catch((err) => console.log(err))
    }

    disconnect() {
        BleManager.disconnect(this.id)
                .then(() => {
                    console.log("Disconnected from " + this.name)
                    this.handler(WalterBleEvent.DISCONNECTED)
                })
                .catch((err) => console.log(err))
    }

    handleDiscoverPeripheral = (peripheral) => {
        if (peripheral.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
            this.id = peripheral.id
            this.name = peripheral.name

            this.handler(WalterBleEvent.FOUND)
        }
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped. Devices: ', this.name)
        this.handler(WalterBleEvent.SCANNED)
    }

    handleNotifications = ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const buf = Buffer.from(value)
        const waterLevel = buf.readUInt32LE(0)

        this.handler(WalterBleEvent.VALUE, waterLevel)
    }

    switchOnNotify() {
        BleManager.retrieveServices(this.id)
            .then((peripheralInfo) => {
                if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                    BleManager.startNotification(this.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
                        .then(() => {
                            console.log("Notification started")
                            this.handler(WalterBleEvent.NOTIFYON)
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
                this.handler(WalterBleEvent.NOTIFYOFF)
            })
            .catch((error) => console.log(error))
    }

    bond() {
        BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
            var bondFound = false;

            for(const peripheral of bondedPeripheralsArray) {
                if (peripheral.id == this.id) {
                    console.log("Already Bonded to " + this.name)
                    
                    this.handler(WalterBleEvent.BONDED)
                    
                    bondFound = true
                    break
                }
            }

            if (!bondFound) {
                BleManager.createBond(this.id)
                    .then(() => {
                        console.log("Bonded to " + this.name)
                        this.handler(WalterBleEvent.BONDED)
                    })
                    .catch((err) => console.log(err))
            }
        });
    }

    checkConnection() {
        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            for (const peripheral of peripheralsArray) {
                BleManager.retrieveServices(peripheral.id)
                    .then((peripheralInfo) => {
                        if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                            console.log("Already Connected to " + peripheralInfo.advertising.localName)

                            this.id = peripheral.id
                            this.name = peripheralInfo.advertising.localName

                            //emit event "found" and "connected"
                            this.handler(WalterBleEvent.FOUND)
                            this.handler(WalterBleEvent.CONNECTED)
                        }
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

}