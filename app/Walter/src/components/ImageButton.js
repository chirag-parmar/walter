import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

export class ImageButton extends Component{
    state = {
        enabled: true
    }
    
    constructor(props) {
        super(props)

        this.styles = StyleSheet.create({
            image: {
                width: this.props.size,
                height: this.props.size,
            }
        });
    }

    render() {

        if (this.state.enabled) {
            return (
                <View style={[this.props.style]}>
                    <TouchableOpacity onPress={() => this.props.onPress()}>
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