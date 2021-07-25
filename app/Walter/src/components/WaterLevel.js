import React from 'react';
import { Component } from 'react';
import { Image, StyleSheet, Animated, View, TouchableOpacity } from 'react-native';
import Svg, { Path } from "react-native-svg";

const AnimatedPath = new Animated.createAnimatedComponent(Path)

export class WaterLevel extends Component{

    state = {
        waveTranslation: new Animated.Value(0),
    }

    constructor(props) {
        super(props)

        var t = this.props.width/10
        var w = this.props.width
        var h = this.props.height
        var r = this.props.range[1] - this.props.range[0]
        var v = (this.props.waterLevel * r) + this.props.range[0]
        var l = (1 - v) * h

        this.path = this.state.waveTranslation.interpolate(
            {
                inputRange: [0, 1],
                outputRange: [
                    "M0 " + (l+50) + " C" + t*4 + " " + (l + 200) + " " + t*9 + " " + (l - 100) + " " + w + " " + (l+50) + " V" + h + " H0 V" + (l+50), 
                    "M0 " + (l+50) + " C" + t*1 + " " + (l - 100) + " " + t*6 + " " + (l + 200) + " " + w + " " + (l+50) + " V" + h + " H0 V" + (l+50)
                ]
            },
        )
    }

    animate(dampFactor = 0.00) {   
        Animated.timing(this.state.waveTranslation, {
            toValue: 1 - dampFactor,
            duration: 1000,
            useNativeDriver: true
        }).start(({finished}) => {
            Animated.timing(this.state.waveTranslation, {
                toValue: 0 + dampFactor,
                duration: 1000,
                useNativeDriver: true
            }).start(({finished}) => {
                if (dampFactor < 0.35) {
                    this.animate(dampFactor+0.05)
                } else {
                    this.animate(dampFactor)
                }
            })
        })
    }

    componentDidMount() {
        this.animate()
    }

    render() {

        if (this.props.enabled) {
            return (
                <View>
                    <Svg height={this.props.height} width={this.props.width}>
                        <AnimatedPath 
                            d={this.path}
                            fill={this.props.waterColor}
                            stroke="none"
                        />
                    </Svg>
                </View>
                
            )
        }

        return null
        
    }
}