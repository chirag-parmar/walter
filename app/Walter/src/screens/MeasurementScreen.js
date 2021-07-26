import React from 'react';
import { Component } from 'react';
import { Modal, Pressable, Dimensions, StyleSheet, View, Text } from 'react-native';

import { WaterLevel } from "../components/WaterLevel.js"
import { RoundButton } from "../components/RoundButton.js"

import {CalibrationScreen} from "./CalibrationScreen.js"

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
    }
});

export class MeasurementScreen extends Component {
    state = {
        modalVisible: false
    }

    constructor(props) {
        super(props)
        this.calibrationValues = { min: [], max: []}
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    calibrate(recordType) {
        var recordValue = this.props.value

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

            console.log("Average of Min Value: " + minAvg)
            console.log("Average of Max Value: " + maxAvg)

            const percentValue = ((value - minAvg)/(maxAvg - minAvg)).toFixed(2)

            console.log("Percent Value in %: " + percentValue)

            return percentValue
        }

        return (value/(value*2)).toFixed(2)
    }

    render() {
        if (this.props.enabled) {
            return (
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <WaterLevel
                        enabled={this.props.enabled}
                        width={Dimensions.get('window').width}
                        height={Dimensions.get('window').height}
                        waterColor={"#000000"}
                        waterLevel={this.getPercentageLevel(this.props.value)}
                        range={[0.2, 0.95]}
                    />
                    <Text style={styles.label}>1x</Text>
                    <RoundButton
                        style={styles.calibrateButton} 
                        size={Dimensions.get('window').width/7}
                        color="#FFFFFF"
                        onPress={() => this.setModalVisible(true)}
                        imageSrc={require('../resources/water-bottle-blue.png')}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.setModalVisible(false)}
                    >
                        <CalibrationScreen 
                            handleCalibrateMin={() => this.calibrate("min")}
                            handleCalibrateMax={() => this.calibrate("max")}
                            handleFinishCalibration={() => this.setModalVisible(false)} 
                        />
                    </Modal>
                </View>
            )
        }

        return null
        
    }
}