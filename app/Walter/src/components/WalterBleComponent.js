import React from 'react';
import {Component} from 'react';
import { bytesToString } from "convert-string";
import { Dimensions, Image, StyleSheet, View, TouchableOpacity } from 'react-native';

import { NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const WALTER_SERVICE_UUID = "65ea1400-adcd-f440-923e-c5c7abab9c99"
const WALTER_CHARACTERISITIC_UUID = "1401"

const styles = StyleSheet.create({
    walterIcon: {
        width: Dimensions.get('window').width/3,
        height: Dimensions.get('window').width/3,
    },
    walterContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
});

export class WalterBle extends Component{
    state = {
        found: false,
        foundId: null,
        foundName: null,
        connected: false
    }

    handleDiscoverPeripheral = (peripheral) => {
        const { peripherals } = this.state
      
        if (peripheral.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
            this.setState({
                found: true,
                foundId: peripheral.id,
                foundName: peripheral.name,
                connected: false
            })
        }
    }
      
    handleStopScan = () => {
        console.log('Scan is stopped. Devices: ', this.state.foundName)
    }

    handleNotifications = ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const data = value.toString();
        console.log(`Recieved ${data} for characteristic ${characteristic}`)
    }

    turnOnNotifications() {
        BleManager.startNotification(this.state.foundId, WALTER_SERVICE_UUID, WALTER_CHARACTERISITIC_UUID)
            .then(() => {
                // Success code
                console.log("Notification started");
            })
            .catch((error) => {
                // Failure code
                console.log("Notification Error: " + error);
                
                setTimeout(
                    function() {
                        this.turnOnNotifications();
                    }
                    .bind(this),
                    5000
                  );
            });
    }

    bond() {
        BleManager.getBondedPeripherals([]).then((bondedPeripheralsArray) => {
            var bondFound = false;

            for(const peripheral of bondedPeripheralsArray) {
                if (peripheral.id == this.state.foundId) {
                    console.log("Already Bonded to " + this.state.foundName)
                    this.setState({
                        bonded: true
                    })
                    this.turnOnNotifications()
                    bondFound = true
                    break
                }
            }

            if (!bondFound) {
                BleManager.createBond(this.state.foundId)
                    .then(() => {
                        console.log("Bonded to " + this.state.foundName)
                        this.setState({
                            bonded: true
                        })
                        this.turnOnNotifications()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        });
    }

    onBtnPress() {
        if (this.state.connected) {
            BleManager.disconnect(this.state.foundId)
                .then(() => {
                    console.log("Disconnected from " + this.state.foundName)
                    this.setState({
                        connected: false,
                        found: false
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (!this.state.connected && this.state.found) {
            console.log("Attempting to Connect to " + this.state.foundName)
            BleManager.connect(this.state.foundId)
                .then(() => {
                    console.log("Connected to " + this.state.foundName)
                    this.setState({
                        connected: true
                    })
                    this.bond()
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (!this.state.found) {
            BleManager.scan([], 5, true).then((objs) => {
                // Success code
                console.log("Scanning Started")
            });
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

        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            for (const peripheral of peripheralsArray){
                BleManager.retrieveServices(peripheral.id)
                    .then((peripheralInfo) => {
                        if (peripheralInfo.advertising.serviceUUIDs.includes(WALTER_SERVICE_UUID)) {
                            console.log("Already Connected to " + peripheralInfo.advertising.localName)
                            this.setState({
                                found: true,
                                foundId: peripheral.id,
                                foundName: peripheralInfo.advertising.localName,
                                connected: true,
                                bonded: false
                            })

                            this.bond()
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            }
        });
    }

    render() {
        var imageBottle = (
            <Image
                style={styles.walterIcon}
                source={require('../resources/water-bottle.png')}
            />
        )
        
        if (this.state.found) {
            imageBottle = (
                <Image
                    style={styles.walterIcon}
                    source={require('../resources/water-bottle-blue.png')}
                />
            )
        } 
        
        if (this.state.connected) {
            imageBottle = (
                <Image
                    style={styles.walterIcon}
                    source={require('../resources/water-bottle-green.png')}
                />
            )

            // readValue = 
        }

        return (
            <View style={styles.walterContainer}>
                <TouchableOpacity onPress={() => this.onBtnPress()}>
                    {imageBottle}
                </TouchableOpacity>
            </View>
        )
    }
}