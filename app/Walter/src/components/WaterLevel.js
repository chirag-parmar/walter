import React from 'react';
import { Component } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Path } from "react-native-svg";

const AnimatedPath = new Animated.createAnimatedComponent(Path)

export class WaterLevel extends Component {

    state = {
        waveTranslation: new Animated.Value(0),
        levelTranslation: new Animated.Value(0),
    }

    constructor(props) {
        super(props)
        
        var w = this.props.width
        var t = this.props.width/10
        var h = this.props.height
        var l = this.props.height/10

        this.path = this.state.waveTranslation.interpolate(
            {
                inputRange: [0, 1],
                outputRange: [
                    "M0 " + (2*l) + " C" + t*4 + " " + (2.5*l) + " " + t*9 + " " + (-l/2) + " " + w + " " + (l/4) + " V" + h + " H0 V0", 
                    "M0 " + (l/4) + " C" + t*1 + " " + (-l/2) + " " + t*6 + " " + (2.5*l) + " " + w + " " + (2*l) + " V" + h + " H0 V0"
                ]
            },
        )

        this.boostWave = true
    }

    animateWave(dampFactor = 0.00) {   
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
                    this.animateWave(dampFactor+0.05)
                } else if (this.boostWave) {
                    this.boostWave = false
                    this.animateWave()
                } else {
                    this.animateWave(dampFactor)
                }
            })
        })
    }

    componentDidMount() {
        this.animateWave()
    }

    componentDidUpdate() {
        this.updateLevel(this.props.waterLevel)
    }

    updateLevel(level) {

        if(level === undefined || isNaN(level)) return

        if (level > 1) level = 1
        if (level < 0) level = 0

        var h = this.props.height
        var r = this.props.range[1] - this.props.range[0]
        var v = (level * r) + this.props.range[0]
        var l = (1 - v) * h

        console.log(l)

        Animated.timing(this.state.levelTranslation, {
            toValue: l,
            duration: 1000,
            useNativeDriver: false
        }).start()

        if ( Math.abs(l - this.state.levelTranslation._value)/h > 0.1) {
            this.boostWave = true
        }
    }

    render() {

        if (this.props.enabled) {
            return (
                <View style={{
                    width: this.props.width,
                    height: this.props.height,
                    overflow: "hidden",
                    zIndex: 4
                }}>
                    <Animated.View style={{
                        width: this.props.width,
                        height: this.props.height,
                        position: "absolute",
                        top: this.state.levelTranslation
                    }}>
                        <Svg height={this.props.height} width={this.props.width}>
                            <AnimatedPath 
                                d={this.path}
                                fill={this.props.waterColor}
                                stroke="none"
                            />
                        </Svg>
                    </Animated.View>
                        
                </View>
                
            )
        }

        return null
        
    }
}