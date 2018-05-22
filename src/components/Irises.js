import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
import color from 'color';
import Palette from 'google-material-color/dist/palette';

import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

import Probability from '../Probability';


const {height, width} = Dimensions.get('window');
const UNITS_OF_EYE_MOVEMENT = 6;

export default React.createClass({
  getInitialState() {
    return {
      eyeMovementX: new Animated.Value(0),
      eyeMovementY: new Animated.Value(0),
    };
  },

  render() {
    var irisProps = {
      fill: '#66747A',
      stroke: color('#66747A').lighten(0.9).hexString(),
    };

    return (
      <Animated.View style={{left: this.state.eyeMovementX, top: this.state.eyeMovementY}}>
        <Svg width={this.props.cellSize} height={this.props.cellSize} viewBox={`0 0 1000 1000`}>
          <Circle
            {...irisProps}
            cx={300}
            cy={330} r="80"/>
          <Circle
            {...irisProps}
            cx={700}
            cy={330} r="80"/>
        </Svg>
      </Animated.View>
    );
  },

  componentDidMount() {
    this.probabilities = [
      new Probability({
        actions: {
          chance: 3,
          do: () => {
            Animated.timing(this.state.eyeMovementX, {
              toValue: this._getRandomEyeLocation(),
              duration: 500
            }).start();
          }
        }
      }),
      new Probability({
        actions: {
          chance: 3,
          do: () => {
            Animated.timing(this.state.eyeMovementY, {
              toValue: this._getRandomEyeLocation(),
              duration: 500
            }).start();
          }
        }
      }),
      new Probability({
        actions: {
          chance: 3,
          do: () => {
            Animated.timing(this.state.eyeMovementX, {
              toValue: this._getRandomEyeLocation(),
              duration: 500
            }).start();
            Animated.timing(this.state.eyeMovementY, {
              toValue: this._getRandomEyeLocation(),
              duration: 500
            }).start();
          }
        }
      })
    ];
  },

  componentWillUnmount() {
    for(var i=0;i<this.probabilities.length;i++) {
      this.probabilities[i].clear();
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  },

  _getRandomEyeLocation() {
    return (Math.random() * UNITS_OF_EYE_MOVEMENT) - UNITS_OF_EYE_MOVEMENT / 2;
  }
});

const baseStyles = StyleSheet.create({
  component: {
    position: 'absolute'
  }
});
