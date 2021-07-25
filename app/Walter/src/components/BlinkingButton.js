import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, Animated, View, TouchableOpacity } from 'react-native';

export class BlinkingButton extends Component{
    state = {
        size: new Animated.Value(1.1)
    }
    
    constructor(props) {
        super(props)

        this.styles = StyleSheet.create({
            circle: {
                width: this.props.size,
                height: this.props.size,
                borderRadius: this.props.size,
                backgroundColor: this.props.color,
                zIndex: 0,
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
            },
            image: {
                width: this.props.size,
                height: this.props.size,
                zIndex: 1
            }
        });
    }

    startAnimation() {
        Animated.timing(this.state.size, {
            toValue: 1.4,
            duration: 1000,
            useNativeDriver: true
        }).start(({finished}) => {
            Animated.timing(this.state.size,{
                toValue: 1.1,
                duration: 1000,
                useNativeDriver: true
            }).start(({finsihed}) => {
                if (this.props.blink) this.startAnimation()
                else this.setState({animating: false})
            })
        })
    }

    render() {

        if (this.props.blink && !this.state.animating) {
            this.startAnimation()
            this.setState({ animating: true })
        }

        const transform = [{
            scaleX: this.state.size,
            scaleY: this.state.size,
        }];


        return (
            <View>
                <Animated.View style={[this.styles.circle, transform]}>
                </Animated.View>
                <TouchableOpacity onPress={() => this.props.onPress()}>
                    <Image
                        style={this.styles.image}
                        source={this.props.imageSrc}
                    />
                </TouchableOpacity>
            </View>
            
        )
    }
}