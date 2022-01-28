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
      backgroundColor: Colors.darker
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
                    <Text style={styles.instructions}>
                        {"1. Empty the bottle and press the first button\n" +
                        "2. Fill the bottle full and press the other button\n" +
                        "3. Repeat above steps atleast 3 times\n" +
                        "4. Finish Calibration"
                        }
                    </Text>
                    <RectangularButton 
                        width={Dimensions.get('window').width*0.8}
                        height={Dimensions.get('window').width*0.12}
                        color="magenta"
                        style={styles.button}
                        title="Record Low" 
                        onPress={this.props.handleCalibrateMin}
                    />
                    <RectangularButton 
                        width={Dimensions.get('window').width*0.8}
                        height={Dimensions.get('window').width*0.12}
                        color="magenta"
                        style={styles.button}
                        title="Record High" 
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

