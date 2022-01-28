import React from 'react';
import { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

export class StatusBadge extends Component{
    state = {
        enabled: true
    }
    
    constructor(props) {
        super(props)

        this.styles = StyleSheet.create({
            badge: {
                flexDirection: "row",
                width: this.props.width,
                height: this.props.height,
                borderRadius: this.props.height,
                borderColor: this.props.color,
                borderWidth: this.props.height*0.05,
                margin: this.props.style.margin
            },
            light: {
                width: this.props.height*0.6,
                height: this.props.height*0.6,
                borderRadius: this.props.height*0.6,
                backgroundColor: this.props.lightColor,
                margin: this.props.height*0.15
            },
            label: {
                flex: 1,
                color: this.props.color,
                fontSize: this.props.height*0.6,
                textAlign: "center"
            },
        });
    }

    render() {

        if (this.state.enabled) {
            return (
                <View>
                    <TouchableOpacity style={[this.styles.badge]} onPress={() => this.props.onPress()}>
                        <View style={[this.styles.light]} key={this.props.text}/>
                        <Text style={[this.styles.label]}> {this.props.text} </Text>
                    </TouchableOpacity>
                </View>
                 
            )
        }

        return null
        
    }
}