import React from 'react';
import { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export class RectangularButton extends Component{
    state = {
        enabled: true
    }
    
    constructor(props) {
        super(props)

        this.styles = StyleSheet.create({
            rectangle: {
                width: this.props.width,
                height: this.props.height,
                borderRadius: this.props.width * 0.05,
                backgroundColor: this.props.color,
                alignItems: 'center',
                justifyContent: 'center'
            },
        });
    }

    render() {

        if (this.state.enabled) {
            return (
                <View style={[this.styles.rectangle, this.props.style]}>
                    <TouchableOpacity  onPress={() => this.props.onPress()}>
                        <Text style={[this.props.style]}>{this.props.title}</Text>
                    </TouchableOpacity>
                </View>
                
                
            )
        }

        return null
        
    }
}