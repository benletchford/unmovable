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

import Mouth from './Mouth';
import Irises from './Irises';


const {height, width} = Dimensions.get('window');
const UNITS_OF_EYE_MOVEMENT = 100;
const ACTION_FREQUENCY = 2500;


export default React.createClass({
  render() {
    var styles = StyleSheet.create({
      component: {
        left: (this.props.parentSize.width / 2) - this.props.cellSize / 2,
        top: (this.props.parentSize.height / 2) - this.props.cellSize / 2,
      }
    });

    var eyeProps = {
      fill: '#FAFBFB',
      stroke: color('#FAFBFB').lighten(0.9).hexString(),
    };
    var irisProps = {
      fill: '#66747A',
      stroke: color('#66747A').lighten(0.9).hexString(),
    };
    var mouthProps = {
      fill: 'none',
      stroke: color('#FAFBFB').lighten(0.9).hexString(),
      strokeLinecap: 'round',
      strokeWidth: 1000 * 0.07,
    };
    return (
      <View style={[baseStyles.component, styles.component]}>
        <Svg style={{position: 'absolute'}} width={this.props.cellSize} height={this.props.cellSize} viewBox={`0 0 1000 1000`}>
          <Circle
            {...eyeProps}
            cx="30%"
            cy="35%"
            r="160"/>
          <Circle
            {...eyeProps}
            cx="70%"
            cy="35%"
            r="160"/>

          <Mouth cellSize={this.props.cellSize}></Mouth>
        </Svg>

        <Irises cellSize={this.props.cellSize}></Irises>
      </View>
    );
  },

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  },
});

const baseStyles = StyleSheet.create({
  component: {
    position: 'absolute'
  }
});
