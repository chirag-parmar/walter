import React from 'react';
import {Component, useRef} from 'react';
import { Buffer } from 'buffer';
import { AppState, Dimensions, StyleSheet, View, Text } from 'react-native';

import { BlinkingButton } from "./BlinkingButton.js"

import { NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"

const styles = StyleSheet.create({
    walterContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    walterText: {
        paddingTop: 20,
        paddingRight: 10,
        fontSize: 20,
        color: Colors.lighter,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export class WalterBle extends Component{
    state = {
        connecting: false,
        found: false,
        id: null,
        name: null,
        connected: false,
        waterLevel: 0,
    }

    handleDiscoverPeripheral = (peripheral) => {
        const { peripherals } = this.state
      
        if (peripheral.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
            this.setState({
                id: peripheral.id,
                name: peripheral.name,
                found: true
            })
        }
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped. Devices: ', this.state.name)

        BleManager.connect(this.state.id)
                .then(() => {
                    console.log("Connected to " + this.state.name)
                    this.setState({ connected: true, connecting: false })
                    this.bond()
                })
                .catch((err) => console.log(err))
    }

    handleNotifications = ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const buf = Buffer.from(value)
        const waterLevel = buf.readUInt32LE(0)

        console.log("Water Level: " + waterLevel.toString())

        this.setState({ waterLevel: waterLevel })
    }

    turnOnNotifications() {

        BleManager.retrieveServices(this.state.id)
            .then((peripheralInfo) => {
                if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                    BleManager.startNotification(this.state.id, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
                        .then(() => console.log("Notification started"))
                        .catch((error) => console.log(error))
                }
            })
            .catch((err) => console.log(err))
    }

    bond() {
        BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
            var bondFound = false;

            for(const peripheral of bondedPeripheralsArray) {
                if (peripheral.id == this.state.id) {
                    console.log("Already Bonded to " + this.state.name)
                    
                    this.setState({ bonded: true })
                    this.turnOnNotifications()
                    
                    bondFound = true
                    
                    break
                }
            }

            if (!bondFound) {
                BleManager.createBond(this.state.id)
                    .then(() => {
                        console.log("Bonded to " + this.state.name)
                        this.setState({ bonded: true })
                        this.turnOnNotifications()
                    })
                    .catch((err) => console.log(err))
            }
        });
    }

    onBtnPress() {
        if (this.state.connected) {
            BleManager.disconnect(this.state.id)
                .then(() => {
                    console.log("Disconnected from " + this.state.name)
                    this.setState({ connected: false, found: false })
                })
                .catch((err) => console.log(err))
        } else {
            BleManager.scan([], 5, true)
                .then(() => {
                    console.log("connecting Started")
                    this.setState({ connecting: true})
                })
                .catch((err) => console.log(err))
        }
    }

    componentDidMount() {
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

        AppState.addEventListener('change', this.handleAppStateChange)
    }

    checkConnectedDevices() {
        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            for (const peripheral of peripheralsArray){
                BleManager.retrieveServices(peripheral.id)
                    .then((peripheralInfo) => {
                        if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                            console.log("Already Connected to " + peripheralInfo.advertising.localName)
                            this.setState({
                                found: true,
                                id: peripheral.id,
                                name: peripheralInfo.advertising.localName,
                                connected: true,
                                bonded: false
                            })

                            this.bond()
                        }
                    })
                    .catch((err) => console.log(err))
            }
        });
    }
    
    handleAppStateChange = (nextAppState) => {
        if (nextAppState.match(/inactive/)) {
            BleManager.disconnect(this.state.id)
                .then(() => {
                    console.log("Disconnected from " + this.state.name);
                })
                .catch((err) => console.log(err))
        }
    }

    render() {
        var imageBottle = require('../resources/water-bottle.png')
        var textBottle = "Tap to Scan"
        
        if (this.state.found) {
            imageBottle = require('../resources/water-bottle-blue.png')
            textBottle = "Found"
        } 
        
        if (this.state.connected) {
            textBottle = "Connected"
        }

        return (
            <View style={styles.walterContainer}>
                <BlinkingButton 
                    size={Dimensions.get('window').width/3} 
                    blink= {this.state.connecting} 
                    imageSrc={imageBottle}
                    color= {"red"}
                    onPress={() => this.onBtnPress()}
                />
                <Text style={styles.walterText}>{textBottle}</Text>
            </View>
        )
    }
}