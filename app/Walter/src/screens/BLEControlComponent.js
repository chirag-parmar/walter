import React from 'react';
import { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WalterBleInstance } from "../interfaces/WalterBle.js"
import { StatusBadge } from "../components/StatusBadge.js"

export class BLEControlComponent extends Component{
    state = {
        enabled: true,
        bleStatus: "setup",
        device: null,
        active: false,
    }

    onBtnPress() {
        if (!this.state.active){
            if (this.state.bleStatus == "disconnected") {
                WalterBleInstance.connect(this.state.device)
            } else if (this.state.bleStatus == "found") {
                WalterBleInstance.connect(this.state.device)
            } else if (this.state.bleStatus == "setup") {
                this.setState({ active: true })
                WalterBleInstance.scan(5000)
            } else if (this.state.bleStatus == "connected") {
                WalterBleInstance.disconnect(this.state.device)
            }
        }
    }

    bleHandler(event, value) {
        switch(event) {
            case "scanning": {
                this.setState({ active: true })
                break
            } 
            case "scanned": {
                this.setState({ active: false })
                break
            }
            case "found": {
                this.setState({ 
                    bleStatus: "found",
                    device: value
                })

                AsyncStorage.setItem("@device", JSON.stringify(value)).catch((e) => console.log(e))

                break
            }
            case "connected": {
                this.setState({ bleStatus: "connected" })
                WalterBleInstance.switchOnNotify(this.state.device);
                break
            }
            case "disconnected": {
                this.setState({ bleStatus: "disconnected" })

                break
            }
            default:
                break
        }
    }

    checkBLEStatus() {

        console.log("Checking BLE Status")
        WalterBleInstance.checkPowerOnStatus()

        AsyncStorage.getItem("@device")
            .then((data) => {

                // if data is in storage but not in the app's context -> add it
                if (!this.state.device && data) {
                    console.log("found device in storage")
                    this.setState({device: JSON.parse(data)})
                }

                // if the data is not in storage but is in the memory -> store it
                if (!data && this.state.device) {
                    console.log("found device in memory")
                    AsyncStorage.setItem("@device", JSON.stringify(this.state.device)).catch((e) => console.log(e))
                } 

                if (this.state.device) {
                    WalterBleInstance.checkConnection(this.state.device).then((connected) => {
                        if (connected) {
                            this.setState({ bleStatus: "connected" })
                            WalterBleInstance.switchOnNotify(this.state.device)
                        } else {
                            this.setState({ bleStatus: "disconnected" })
                            WalterBleInstance.connect(this.state.device)
                        }
                    })
                    
                } else {
                    this.setState({ bleStatus: "setup" })
                }
                
            })
            .catch((e) => {
                // if the data is also not avialble in memory
                if (!this.state.device) {
                    this.setState({ bleStatus: "setup" })
                } else { // else store it
                    AsyncStorage.setItem("@device", JSON.stringify(this.state.device)).catch((e) => console.log(e))
                }
            })
        
    }

    componentDidMount() {

        DeviceEventEmitter.addListener("WalterBleEvent", (eventObj) => {
            this.bleHandler(eventObj.event, eventObj.value)
        })

        this.checkBLEStatus()

        this.timer = setInterval(this.checkBLEStatus.bind(this), 35000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {

        if (this.state.enabled) {

            let labelText
            let lightColor

            if (this.state.bleStatus == "found") {
                labelText = "Tap to Connect"
                lightColor = "blue"
            } else if (this.state.bleStatus == "connected") {
                labelText = "Connected"
                lightColor = "green"
            } else if (this.state.bleStatus == "disconnected") {
                labelText = "Disconnected"
                lightColor = "gray"
            } else if (this.state.bleStatus == "setup") {
                labelText = "Tap to Setup"
                lightColor = "red"
            } else if (this.state.active == true) {
                labelText = "Scanning"
                lightColor = "gray"
            }

            return (
                <StatusBadge
                        key = {labelText} 
                        style= {this.props.style}
                        width= {this.props.width} 
                        height= {this.props.height} 
                        color= "#000000"
                        lightColor= {lightColor}
                        onPress= {()  => this.onBtnPress()}
                        text=  {labelText}
                />
                
            )
        }

        return null;
    }
}