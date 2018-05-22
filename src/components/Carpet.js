import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions
} from 'react-native';
import Reflux from 'reflux';
import color from 'color';
import Palette from 'google-material-color/dist/palette';
import { DIFFICULTY_COLORS } from '../Utilities';

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

import SettingsStore from '../stores/SettingsStore';

const {height, width} = Dimensions.get('window');

export default React.createClass({
  mixins: [
    Reflux.connect(SettingsStore, 'settings')
  ],

  render() {
    var styles = {
      component: {
        backgroundColor: color(DIFFICULTY_COLORS[this.state.settings.difficulty]['500']).alpha(0.7).rgbaString()
      }
    };

    return (
      <View style={[this.props.style, styles.component]}>
      </View>
    );
  },
});
