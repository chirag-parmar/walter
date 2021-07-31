import React from 'react';
import { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, DeviceEventEmitter } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { BlinkingButton } from "../components/BlinkingButton.js"
import { WalterBleInstance} from "../interfaces/WalterBle.js"

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    instrLabel: {
        paddingTop: 20,
        paddingRight: 5,
        fontSize: 20,
        color: Colors.lighter,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waterLevelContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: "#79d78f"
    },
});

export class BleScreen extends Component{
    state = {
        instr: "Tap to Scan",
        btnColor: "#9F9F9F", // #dbdbdb, 
        active: false,
        found: false,
        connected: false,
        btnImage: require('../resources/water-bottle.png')
    }

    onBtnPress() {
        if (this.state.found && !this.state.connected && !this.state.active) {
            this.setState({ active: true })
            WalterBleInstance.connect()
        } else if (!this.state.found && !this.state.active) {
            WalterBleInstance.scan()
        } else if (this.state.connected && !this.state.active) {
            this.props.handleFinishBluetooth()
        }
    }

    bleHandler(event, value) {
        switch(event) {
            case "scanning": {
                this.setState({ active: true })
                break
            }
            case "scanned": {
                if (this.state.found) {
                    this.setState({
                        active: false,
                        instr: "Tap to Connect",
                        btnColor: "#BBFFFE" // #79DDDC
                    })
                } else {
                    this.setState({ active: false })
                }
                break
            }
            case "found": {
                this.setState({ 
                    found: true,
                    instr: "Found",
                    btnImage: require('../resources/water-bottle-blue.png')
                })
                break
            }
            case "connected": {
                this.setState({ 
                    connected: true, 
                    active: false,
                    instr: "Connected. Tap to Close",
                    btnColor: "#79d78f"
                })
                WalterBleInstance.bond()
                break
            }
            case "disconnected": {
                this.setState({ 
                    connected: false,
                    found: false,
                })
                break
            }
            case "bonded": {
                if (this.state.connected) {
                    WalterBleInstance.switchOnNotify()
                }
                break
            }
            case "notifyon":
            case "notifyoff":
            default:
                break
        }
    }

    componentDidMount() {

        DeviceEventEmitter.addListener("WalterBleEvent", (eventObj) => {
            this.bleHandler(eventObj.event, eventObj.value)
        })

        WalterBleInstance.checkConnection()
    }

    render() {

        return (
            <View style={styles.container}>
                <BlinkingButton
                    key={this.state.btnColor}
                    size={Dimensions.get('window').width/3} 
                    blink= {this.state.active} 
                    imageSrc={this.state.btnImage}
                    color={this.state.btnColor}
                    onPress={() => this.onBtnPress()}
                />
                <Text style={styles.instrLabel}>{this.state.instr}</Text>
            </View>
        )
    }
}