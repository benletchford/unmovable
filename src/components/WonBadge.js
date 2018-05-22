import React, { Component } from 'react';
import Reflux from 'reflux';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import color from 'color';
import Palette from 'google-material-color/dist/palette';
import * as Animatable from 'react-native-animatable';

import AppText from './AppText';
import { GameActions, WonBadgeActions } from '../Actions'
import BadgeStore from '../stores/BadgeStore';


const AnimatedView = Animatable.createAnimatableComponent(View);
const {height, width} = Dimensions.get('window');

const COMPONENT_WIDTH = width * 0.8;
const FONT_SIZE = COMPONENT_WIDTH * 0.15 >> 0;
const TEXT_PADDING = FONT_SIZE >> 0;
const BORDER_SIZE = 5;
const BORDER_RADIUS = 20;
const STAR_TEXT = [
  'Not Bad!',
  'Great!',
  'Perfect!'
]


export default React.createClass({
  mixins: [
    Reflux.listenTo(WonBadgeActions.show, 'gameWon'),
    Reflux.listenTo(GameActions.set, 'gameSet'),
  ],

  getInitialState() {
    return {
      showTop: ((height / 2) - FONT_SIZE),
      hideTop: height * 2,
      currentTop: height * 2,
      stars: 3
    }
  },

  render() {
    var styles = {
      component: {
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: this.state.currentTop,
        left: 0,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
      },
      subcomponent: {
        borderRadius: BORDER_RADIUS,
        borderWidth: BORDER_SIZE,
        paddingLeft: TEXT_PADDING,
        paddingRight: TEXT_PADDING,
        borderColor: Palette.get('Black', 500),
        transform: [
          {rotate: (Platform.OS === 'ios') ? '325deg' : '0deg'}
        ]
      },
      text: {
        textAlign: 'center',
        fontSize: FONT_SIZE,
        color: Palette.get('Black', 500)
      }
    };

    return (
      <AnimatedView ref="el" style={styles.component}>
        <View style={styles.subcomponent}>
          <AppText style={styles.text}>{STAR_TEXT[this.state.stars - 1]}</AppText>
        </View>
      </AnimatedView>
    );
  },

  gameSet() {
    this.state.currentTop = this.state.hideTop;
    this.refs.el.setNativeProps({
      style: {
        top: this.state.currentTop
      }
    });
  },

  gameWon(stars) {
    this.setState({
      stars: stars
    })

    this.state.currentTop = this.state.showTop;
    this.refs.el.setNativeProps({
      style: {
        top: this.state.currentTop
      }
    });
    this.refs.el.tada();
  }
});
