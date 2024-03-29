import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

export class RoundButton extends Component{
    state = {
        enabled: true
    }
    
    constructor(props) {
        super(props)

        this.styles = StyleSheet.create({
            circle: {
                width: this.props.size,
                height: this.props.size,
                borderRadius: this.props.size,
                borderWidth: this.props.size*0.05,
                borderColor: this.props.color,
                padding: this.props.size*0.1
            },
            image: {
                width: this.props.size*0.7,
                height: this.props.size*0.7,
            }
        });
    }

    render() {

        if (this.state.enabled) {
            return (
                <View style={[this.styles.circle, this.props.style]}>
                    <TouchableOpacity  onPress={() => this.props.onPress()}>
                        <Image
                            style={this.styles.image}
                            source={this.props.imageSrc}
                        />
                    </TouchableOpacity>
                </View>
                
                
            )
        }

        return null
        
    }
}