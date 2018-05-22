import React, { Component } from 'react';
import Reflux from 'reflux';
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
import Icon from 'react-native-vector-icons/MaterialIcons';

import { DIFFICULTY_COLORS } from '../Utilities';
import SettingsStore from '../stores/SettingsStore';
import { GameActions, MainMenuActions } from '../Actions'


const {height, width} = Dimensions.get('window');
const COMPONENT_HEIGHT = height * 0.1;
const ICON_HEIGHT = COMPONENT_HEIGHT * 0.7;

export default React.createClass({
  mixins: [
    Reflux.connectFilter(SettingsStore, 'settings', function(settings) {
      return {
        difficulty: settings.difficulty
      };
    })
  ],

  render() {
    var styles = StyleSheet.create({
      component: {
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width,
        height: height * 0.1,
        bottom: 0,
        paddingLeft: 5,
        paddingRight: 10,
        backgroundColor: DIFFICULTY_COLORS[this.state.settings.difficulty]['500']
      }
    });

    return (
      <View style={styles.component}>
        <Icon
          style={styles.pauseButton}
          name="pause"
          size={ICON_HEIGHT}
          color={Palette.get('White', '500')}
          onPress={MainMenuActions.show} />

        <Icon
          style={styles.resetButton}
          name="replay"
          size={ICON_HEIGHT}
          color={Palette.get('White', '500')}
          onPress={GameActions.reset} />
      </View>
    );
  }
});
