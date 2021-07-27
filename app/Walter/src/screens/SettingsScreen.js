import React, { Component } from "react";
import { StyleSheet, Dimensions, View, TextInput, Button, Text } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.darker
    },
    input: {
        height: Dimensions.get("window").height/20,
        margin: 12,
        borderWidth: 1,
        borderColor: "white",
        flex:2
    },
    button: {
        margin: 30
    },
    label: {
        color: "white",
        fontSize: 20,
        flex: 2
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }
});

export class SettingsScreen extends Component {
    state={
        capacity: ""
    }

    onChangeCapacity(number) {
        this.setState({
            capacity: number
        })

        this.props.handleSettings({capacity: number})
    }

    componentDidMount(){
        this.setState(this.props.settings)
    }

    render() {
        return (
            <View style={styles.centeredView}>
                <View style={styles.rowView}>
                    <Text style={styles.label}> Capacity in Litres: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => this.onChangeCapacity(text)}
                        value={this.state.capacity}
                        placeholder="0.5, 0.75, 1, 2 ..."
                        keyboardType="number-pad"
                    />
                </View>
                <Button 
                        style={styles.button}
                        title="Save Settings" 
                        onPress={this.props.handleFinishSettings}
                />
                
            </View>
        )
    }
}

