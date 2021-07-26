import React, { Component } from "react";
import { StyleSheet, Dimensions, Button, View, Text, DeviceEventEmitter } from "react-native";
import { RoundButton } from "../components/RoundButton.js"
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
    roundButton: {
        margin: Dimensions.get("window").width/20
    },
    button: {
        margin: 30
    },
    instructions: {
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

export class CalibrationScreen extends Component {

  render() {
    return (
        <View style={styles.centeredView}>
            <View style={styles.buttonView}>
                <RoundButton
                    style={styles.roundButton}
                    size={Dimensions.get('window').width*0.4}
                    color="#FFFFFF"
                    onPress={this.props.handleCalibrateMin}
                    imageSrc={require('../resources/water-bottle.png')}
                />
                <RoundButton
                    style={styles.roundButton}
                    size={Dimensions.get('window').width*0.4}
                    color="#FFFFFF"
                    onPress={this.props.handleCalibrateMax}
                    imageSrc={require('../resources/water-bottle-blue.png')}
                />
            </View>
            <Text style={styles.instructions}>
                {"1. Empty the bottle and press the first button\n" +
                 "2. Fill the bottle full and press the other button\n" +
                 "3. Repeat above steps atleast 3 times\n" +
                 "4. Finish Calibration"
                }
            </Text>
            <Button 
                style={styles.button}
                title="Finish Calibration" 
                onPress={this.props.handleFinishCalibration}
            />
        </View>
    )
  }
}

