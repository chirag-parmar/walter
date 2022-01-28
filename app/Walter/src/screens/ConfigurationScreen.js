import React, { Component } from "react";
import { StyleSheet, Dimensions, Button, View, Text, DeviceEventEmitter, TextInput } from "react-native";
import { RoundButton } from "../components/RoundButton.js"
import { RectangularButton } from "../components/RectangularButton.js"
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.darker,
    },
    buttonView: {
        flexDirection: "row"
    },
    button: {
        margin: 10,
    },
    input: {
        margin: 12,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "white",
    },
    instructions: {
        flex:1,
        color: "white",
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    heading: {
        color: "white",
        fontSize: 46,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 10,
    }
});

export class ConfigurationScreen extends Component {

    state={
        enabled: true,
        capacity: ""
    }

    onChangeCapacity(number) {
        this.setState({
            capacity: number
        })

        this.props.handleSaveConfig({capacity: number})
    }

    render() {

        if  (this.state.enabled) {
            return (
                <View style={styles.centeredView}>
                    <Text style={styles.heading}>
                        {"TRAIN  WALTER"}
                    </Text>
                    <Text style={styles.instructions}>
                        {"When bottle is empty press the \"Record Empty\" button. When bottle is full press the \"Record Full\" button\n\n" +
                         "Enter the water bottle capacity in milli-litres"
                        }
                    </Text>
                    <RectangularButton 
                        width={Dimensions.get('window').width*0.8}
                        height={Dimensions.get('window').width*0.12}
                        color="magenta"
                        style={styles.button}
                        title="Record Empty" 
                        onPress={this.props.handleCalibrateMin}
                    />
                    <RectangularButton 
                        width={Dimensions.get('window').width*0.8}
                        height={Dimensions.get('window').width*0.12}
                        color="magenta"
                        style={styles.button}
                        title="Record Full" 
                        onPress={this.props.handleCalibrateMax}
                    />
                    <TextInput
                        style={styles.input}
                        width={Dimensions.get('window').width*0.8}
                        height={Dimensions.get('window').width*0.12}
                        onChangeText={text => this.onChangeCapacity(text)}
                        value={this.state.capacity}
                        placeholder="Enter Capacity in ml"
                        keyboardType="number-pad"
                    />
                    <View style={styles.buttonView}>
                        <RectangularButton 
                            width={Dimensions.get('window').width*0.4 - 10}
                            height={Dimensions.get('window').width*0.12}
                            color="red"
                            style={styles.button}
                            title="Erase" 
                            onPress={this.props.handleEraseConfig}
                        />
                        <RectangularButton 
                            style={styles.button}
                            width={Dimensions.get('window').width*0.4 - 10}
                            height={Dimensions.get('window').width*0.12}
                            color="orange"
                            title="Close" 
                            onPress={this.props.handleFinishConfig}
                        />
                    </View>
                </View>
            )
        }
        
    }
}

