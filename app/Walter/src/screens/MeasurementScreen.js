import React from 'react';
import { Component } from 'react';
import { AppState, Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { BlinkingButton } from "../components/BlinkingButton.js"
import { WalterBle, WalterBleEvent} from "../interfaces/WalterBle.js"

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
    }
});

export class MeasurementScreen extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (this.props.enabled) {
            return (
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <Text style={styles.measurement}>{this.props.value}</Text>
                </View>
            )
        }

        return null
        
    }
}