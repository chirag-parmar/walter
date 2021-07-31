import React from 'react';
import { Component } from 'react';
import { AppState, Modal, Dimensions, StyleSheet, View, Text, DeviceEventEmitter } from 'react-native';

import { WaterLevel } from "../components/WaterLevel.js"
import { RoundButton } from "../components/RoundButton.js"

import { WalterBleInstance} from "../interfaces/WalterBle.js"

import {CalibrationScreen} from "./CalibrationScreen.js"
import {SettingsScreen} from "./SettingsScreen.js"
import {BleScreen} from "./BleScreen.js"

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    measurement: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#000000",
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomLeftCorner: {
        justifyContent: 'flex-end'
    },
    calibrateButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 5,
        margin: 10
    },
    label: {
        color: "white",
        position: "absolute",
        margin: 10,
        bottom: 0,
        left: 0,
        fontSize: 40,
        zIndex: 5
    },
    settingsButton: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 5,
        margin: 10
    },
    bluetoothButton: {
        position: "absolute",
        bottom: Dimensions.get('window').width/7 + 10,
        right: 0,
        zIndex: 5,
        margin: 10
    },
});

export class MainScreen extends Component {
    state = {
        calibrationModalVisible: false,
        settingsModalVisible: false,
        bluetoothModalVisible: false,
        connected: false,
        settings: {},
        currentLevel: 0
    }

    constructor(props) {
        super(props)
        this.calibrationValues = { min: [], max: []}
        
    }

    setCalibrationModalVisible = (visible) => {
        this.setState({ calibrationModalVisible: visible });
    }

    setSettingsModalVisible = (visible) => {
        this.setState({ settingsModalVisible: visible });
    }

    setBluetoothModalVisible = (visible) => {
        this.setState({ bluetoothModalVisible: visible });
    }

    setSettings(settings) {
        this.setState({
            settings: settings
        })
    }

    calibrate(recordType) {
        var recordValue = this.state.currentLevel

        if (recordType == "min") {
            this.calibrationValues.min.push(recordValue)
            console.log("Recorded Min Value: " + recordValue)
        } else if (recordType == "max") {
            this.calibrationValues.max.push(recordValue)
            console.log("Recorded Max Value: " + recordValue)
        }
    }

    getPercentageLevel(value) {
        if (this.calibrationValues.min.length > 0 && this.calibrationValues.max.length) {
            const minAvg = this.calibrationValues.min.reduce((s, v) => s + v)/this.calibrationValues.min.length
            const maxAvg = this.calibrationValues.max.reduce((s, v) => s + v)/this.calibrationValues.max.length

            const percentValue = ((value - minAvg)/(maxAvg - minAvg)).toFixed(2)

            return percentValue
        }

        return (value/(value*2)).toFixed(2)
    }

    componentDidMount() {
        DeviceEventEmitter.addListener("WalterBleEvent", (eventObj) => {
            if (eventObj.event == "value") {
                this.setState({ currentLevel: eventObj.value })
            } else if (eventObj.event == "connected") {
                this.setState({ connected: true })
            }
        })

        WalterBleInstance.checkConnection()

        AppState.addEventListener('change', this.handleAppStateChange)
    }
    
    handleAppStateChange = (nextAppState) => {
        if (nextAppState.match(/inactive/)) {
            WalterBleInstance.disconnect()
        }
    }

    render() {
        if (this.props.enabled) {
            return (
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <RoundButton
                        style={styles.settingsButton} 
                        size={Dimensions.get('window').width/10}
                        color="#FFFFFF"
                        onPress={() => this.setSettingsModalVisible(true)}
                        imageSrc={require('../resources/ellipsis.png')}
                    />
                    <WaterLevel
                        enabled={this.props.enabled}
                        width={Dimensions.get('window').width}
                        height={Dimensions.get('window').height}
                        waterColor={"#000000"}
                        waterLevel={this.getPercentageLevel(this.state.currentLevel)}
                        range={[0, 1]}
                    />
                    <Text style={styles.label}>1x</Text>
                    <RoundButton
                        style={styles.bluetoothButton} 
                        size={Dimensions.get('window').width/7}
                        color="#FFFFFF"
                        onPress={() => this.setBluetoothModalVisible(true)}
                        imageSrc={require('../resources/bluetooth.png')}
                    />
                    <RoundButton
                        style={styles.calibrateButton} 
                        size={Dimensions.get('window').width/7}
                        color="#FFFFFF"
                        onPress={() => this.setCalibrationModalVisible(true)}
                        imageSrc={require('../resources/calibrate.png')}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.calibrationModalVisible}
                        onRequestClose={() => this.setCalibrationModalVisible(false)}
                    >
                        <CalibrationScreen 
                            handleCalibrateMin={() => this.calibrate("min")}
                            handleCalibrateMax={() => this.calibrate("max")}
                            handleFinishCalibration={() => this.setCalibrationModalVisible(false)} 
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.settingsModalVisible}
                        onRequestClose={() => this.setSettingsModalVisible(false)}
                    >
                        <SettingsScreen
                            settings={this.state.settings}
                            handleSettings={(settings) => this.setSettings(settings)}
                            handleFinishSettings={() => this.setSettingsModalVisible(false)} 
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.bluetoothModalVisible}
                        onRequestClose={() => this.setBluetoothModalVisible(false)}
                    >
                        <BleScreen 
                            handleFinishBluetooth={() => this.setBluetoothModalVisible(false)}
                        />
                    </Modal>
                </View>
            )
        }

        return null
        
    }
}