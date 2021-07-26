import React from 'react';
import { Component } from 'react';
import { AppState, Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { BlinkingButton } from "../components/BlinkingButton.js"
import { WalterBle, WalterBleEvent} from "../interfaces/WalterBle.js"

import { MeasurementScreen } from "./MeasurementScreen.js"

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
        complete: false,
        waterLevel: 0
    }

    onBtnPress() {
        if (this.state.found && !this.state.connected && !this.state.active) {
            this.setState({ active: true })
            this.ble.connect()
        } else if (!this.state.found && !this.state.active) {
            this.ble.scan()
        }
    }

    bleHandler(event, value) {
        switch(event) {
            case WalterBleEvent.SCANNING: {
                this.setState({ active: true })
                break
            }
            case WalterBleEvent.SCANNED: {
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
            case WalterBleEvent.FOUND: {
                this.setState({ 
                    found: true,
                    instr: "Found"
                })
                break
            }
            case WalterBleEvent.CONNECTED: {
                this.setState({ 
                    connected: true, 
                    active: false,
                    instr: "Connected",
                    btnColor: "#79d78f"
                })
                this.ble.bond()
                break
            }
            case WalterBleEvent.DISCONNECTED: {
                this.setState({ 
                    connected: false,
                    found: false,
                })
                break
            }
            case WalterBleEvent.BONDED: {
                if (this.state.connected) {
                    this.ble.switchOnNotify()
                }
                break
            }
            case WalterBleEvent.VALUE: {
                this.setState({ waterLevel: value })
                break
            }
            case WalterBleEvent.NOTIFYON: {
                setTimeout(() => {
                    this.setState({ instr: "", complete: true})
                }, 500)
                break
            }
            case WalterBleEvent.NOTIFYOFF:
            default:
                break
        }
    }

    componentDidMount() {
        this.ble = new WalterBle(this.bleHandler.bind(this))

        this.ble.checkConnection()

        AppState.addEventListener('change', this.handleAppStateChange)
    }
    
    handleAppStateChange = (nextAppState) => {
        if (nextAppState.match(/inactive/)) {
            this.ble.disconnect()
        }
    }

    render() {
        var btnImage = require('../resources/water-bottle.png')


        if (this.state.found) {
            btnImage = require('../resources/water-bottle-blue.png')
        }

        if (this.state.complete) {
            btnImage = null
        }

        return (
            <View>
                <View style={styles.container}>
                    <BlinkingButton
                        key={this.state.btnColor}
                        size={Dimensions.get('window').width/3} 
                        blink= {this.state.active} 
                        imageSrc={btnImage}
                        color={this.state.btnColor}
                        onPress={() => this.onBtnPress()}
                        resolve={this.state.connected}
                    />
                    <Text style={styles.instrLabel}>{this.state.instr}</Text>
                </View>
                <MeasurementScreen
                    key={this.state.btnColor}
                    enabled={this.state.complete}
                    backgroundColor={"#79d78f"}
                    value={this.state.waterLevel} 
                />
            </View>
        )
    }
}