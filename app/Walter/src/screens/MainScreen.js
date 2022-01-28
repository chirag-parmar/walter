import React from 'react';
import { Component } from 'react';
import { AppState, Modal, Dimensions, StyleSheet, View, DeviceEventEmitter } from 'react-native';

import { ImageButton } from "../components/ImageButton.js"

import {ConfigurationScreen} from "./ConfigurationScreen.js"
import {BLEControlComponent} from "./BLEControlComponent.js"

import AsyncStorage from '@react-native-async-storage/async-storage';

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
    configButton: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 5,
        padding: 14
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
    bleBadge: {
        margin: 10,
    }
});

export class MainScreen extends Component {
    state = {
        configModalVisible: false,
        currentLevel: 0
    }

    constructor(props) {
        super(props)
        this.calibrationValues = { min: [], max: []}
        this.config = null
    }


    setConfigModalVisible = (visible) => {
        this.setState({ configModalVisible: visible });
    }

    saveConfig(config) {
        this.config = config

        console.log("Configuration Saved")

        AsyncStorage.setItem("@configuration", JSON.stringify(this.config)).catch((e) => console.log(e))
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

        AsyncStorage.setItem("@calibration", JSON.stringify(this.calibrationValues)).catch((e) => console.log(e))
    }

    eraseConfig() {
        this.calibrationValues.min = []
        this.calibrationValues.max = []
        this.config = null

        AsyncStorage.removeItem("@calibration").catch((e) => console.log(e))
        AsyncStorage.removeItem("@configuration").catch((e) => console.log(e))

        console.log("Erased all calibrated values")
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
                timestamp = Date.now()
                AsyncStorage.setItem("@" + timestamp.toString(), JSON.stringify(this.calibrationValues)).catch((e) => console.log(e))
            } 
        })

        AsyncStorage.getItem("@configuration").then((data) =>{
            if (data) {
                this.config = JSON.parse(data)
                console.log("Loaded configuration from storage")
            }
        }).catch((e) => console.log(e))

        AsyncStorage.getItem("@calibration").then((data) =>{
            if (data) {
                this.calibrationValues = JSON.parse(data)
                console.log("Loaded calibration values from storage")
            }
        }).catch((e) => console.log(e))

    }

    render() {
        if (this.props.enabled) {
            return (
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <BLEControlComponent
                        style= {styles.bleBadge} 
                        width= {Dimensions.get('window').width*0.5} 
                        height= {Dimensions.get('window').width/12} 
                    />
                    <ImageButton
                        style={styles.configButton} 
                        size={Dimensions.get('window').width/14}
                        onPress={() => this.setConfigModalVisible(true)}
                        imageSrc={require('../resources/ellipsis.png')}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.configModalVisible}
                        onRequestClose={() => this.setConfigModalVisible(false)}
                    >
                        <ConfigurationScreen
                            config = {this.config}
                            handleSaveConfig={(config) => this.saveConfig(config)}
                            handleEraseConfig={() => this.eraseConfig()} 
                            handleFinishConfig={() => this.setConfigModalVisible(false)} 
                            handleCalibrateMin={() => this.calibrate("min")}
                            handleCalibrateMax={() => this.calibrate("max")}                   
                        />
                    </Modal>
                </View>
            )
        }

        return null
        
    }
}