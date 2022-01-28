

import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const manager = new BleManager();

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"

class WalterBle {

    constructor() {
        this.manager = new BleManager('bleManagerRestoredState', (bleRestoredState) => {
                if (bleRestoredState != null) {
                    console.log("Restored Bluetooth")
                    console.log(bleRestoredState.connectedPeripherals)
                }
        })
        this.power = false
        this.notifySubscription = null
    }

    destroy() {
        console.log("Destroyed BLE manager")
        if (this.notifySubscription != null) this.notifySubscription.remove()
        this.manager.destroy()
    }

    checkPowerOnStatus()  {
        this.manager.state().then((state) => {
            if (state === 'PoweredOn') this.power = true
            else this.power = false
        })
    }

    scan(timeout) {
        if (!this.power) {
            console.log("BleManager is not powered on")
            this.checkPowerOnStatus()
            return
        }

        console.log("Scanning for Walters")
        DeviceEventEmitter.emit('WalterBleEvent', {event: "scanning", value: null})

        this.manager.startDeviceScan([WALTER_SERVICE_UUID], null, (error, device) => {
            if (error) {
                console.log(error)
                return
            }
            this.manager.stopDeviceScan()
            console.log("Found " + device.name + " - " + device.id)
            DeviceEventEmitter.emit('WalterBleEvent', {event: "found", value: {id: device.id, name: device.name}})
        });

        // setTimeout(() => {
        //     this.manager.stopDeviceScan()
        //     console.log("Scan stopped")
        //     DeviceEventEmitter.emit('WalterBleEvent', {event: "scanned", value: null})
        // }, timeout)
    }

    connect(peripheral) {
        if (!this.power) {
            console.log("BleManager is not powered on")
            this.checkPowerOnStatus()
            return
        }

        this.manager.connectToDevice(peripheral.id).then((device) => {
            console.log("Connected to " + device.name)
            
            //on new connection remove old listeners that might have been dangling
            if (this.notifySubscription) this.notifySubscription.remove()
            this.notifySubscription = null

            DeviceEventEmitter.emit('WalterBleEvent', {event: "connected", value: null})
        }).catch((err) => console.log(err))
    }

    disconnect(peripheral) {
        if (!this.power) {
            console.log("BleManager is not powered on")
            this.checkPowerOnStatus()
            return
        }

        this.manager.cancelDeviceConnection(peripheral.id).then((device) => {
            console.log("Disconnected from " + peripheral.name)
            DeviceEventEmitter.emit('WalterBleEvent', {event: "disconnected", value: null})
        }).catch((err) => console.log(err))
                
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped')
        DeviceEventEmitter.emit('WalterBleEvent', {event: "scanned", value: null})
    }

    switchOnNotify(peripheral) {
        if (!this.power) {
            console.log("BleManager is not powered on")
            this.checkPowerOnStatus()
            return
        }

        this.manager.discoverAllServicesAndCharacteristicsForDevice(peripheral.id).then((device) => {
            // if we are already listening then just return and don't create another listener
            if (this.notifySubscription) return
            
            this.notifySubscription = this.manager.monitorCharacteristicForDevice(peripheral.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID, (e,c) => {
                if (e) {
                    console.log(e)
                    return
                }
    
                const buf = Buffer.from(c.value, 'base64')
                const waterLevel = buf.readUInt32LE(0)
    
                console.log("Received a new reading: " + waterLevel.toString())
                DeviceEventEmitter.emit('WalterBleEvent', {event: "value", value: waterLevel})
            })
        }).catch(e => console.log(e))

        

        
    }

    checkConnection(peripheral) {
        if (!this.power) {
            console.log("BleManager is not powered on")
            this.checkPowerOnStatus()
            return
        }

        return this.manager.isDeviceConnected(peripheral.id)
    }

}

export const WalterBleInstance = new WalterBle()