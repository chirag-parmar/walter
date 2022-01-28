import React from 'react';
import { Component } from 'react';
import { AppState, Text, Modal, Dimensions, StyleSheet, View, DeviceEventEmitter } from 'react-native';

import { ImageButton } from "../components/ImageButton.js"

import {ConfigurationScreen} from "./ConfigurationScreen.js"
import {BLEControlComponent} from "./BLEControlComponent.js"
import { StatusBadge } from "../components/StatusBadge.js"

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    row: {
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    configButton: {
        padding: 13,
    },
    bleBadge: {
        margin: 10,
    },
    statistics: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: 100,
    },
    statisticsTop: {
        justifyContent: "flex-end",
        height: Dimensions.get('window').height/2,
        alignItems: "center",
        flexDirection: "column",
        fontSize: 100,
    },
    statisticsBottom: {
        height: Dimensions.get('window').height/2,
        width: Dimensions.get('window').width,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#000000",
        fontSize: 100,
    },
    percentageLabel: {
        fontSize: 100,
    },
    bottleLabel: {
        color: "#79d78f",
        fontSize: 20,
        margin: 10
    }
});

export class MainScreen extends Component {
    state = {
        configModalVisible: false,
        currentLevel: 0,
        readingLive: false
    }

    constructor(props) {
        super(props)
        this.calibrationValues = { min: [], max: []}
        this.config = null
        this.liveTimer = null
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

        return (0.5).toFixed(2)
    }

    componentDidMount() {
        DeviceEventEmitter.addListener("WalterBleEvent", (eventObj) => {
            if (eventObj.event == "value") {
                this.setState({ currentLevel: eventObj.value, readingLive: true })

                // clear existing running timer
                if (this.liveTimer != null) clearTimeout(this.liveTimer)

                //set timeout for automatically changing live to false
                this.liveTimer = setTimeout(() => {
                    this.setState({readingLive: false})
                }, 30000)

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

    componentWillUnmount() {
        if (this.liveTimer != null) clearTimeout(this.liveTimer)
    }

    render() {
        if (this.props.enabled) {
            return (
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <View style={[styles.row]}>
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
                    </View>
                    
                    <View style={styles.statistics}>
                        <View style={styles.statisticsTop}>
                            <Text style={styles.percentageLabel}>{this.getPercentageLevel(this.state.currentLevel)*100}%</Text>
                        </View>
                        <View style={styles.statisticsBottom}>
                            <Text style={styles.bottleLabel}>Bottles: 3 | 1700ml</Text>
                            <StatusBadge
                                key = {this.state.readingLive } 
                                style= {{margin: 0}}
                                width= {Dimensions.get('window').width/2} 
                                height= {Dimensions.get('window').width/12} 
                                color= "#79d78f"
                                lightColor= {this.state.readingLive ? "green" : "gray"}
                                onPress= {()  => console.log("liveness button")}
                                text= {this.state.readingLive ? "Sensor Live" : "Sensor Offline"}
                            />
                        </View>
                    </View>
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