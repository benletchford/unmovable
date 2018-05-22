import React, { Component } from 'react';
import Reflux from 'reflux';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder,
  TouchableHighlight
} from 'react-native';
import color from 'color';
import Palette from 'google-material-color/dist/palette';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Swiper from 'react-native-swiper';

import { DIFFICULTY_COLORS } from '../Utilities';
import TimerStore from '../stores/TimerStore'
import BadgeStore from '../stores/BadgeStore'
import GameStore from '../stores/GameStore'
import SettingsStore from '../stores/SettingsStore'
import { GameActions, MainMenuActions, BadgeActions, WonBadgeActions } from '../Actions'
import AppText from './AppText';


const AnimatedIcon = Animatable.createAnimatableComponent(Icon);
const {height, width} = Dimensions.get('window');
const BADGE_HEIGHT = height * 0.05 + 5;
const BADGE_WIDTH = BADGE_HEIGHT * 3;
const STAR_SIZE = 30;
const BADGE_PADDING = 20;


var Star = React.createClass({
  render() {
    var styles = {
      component: {
        backgroundColor: 'rgba(0,0,0,0)',
      }
    };

    var color = this.props.filled ? Palette.get('Yellow', '500') : Palette.get('Black', '500')
    return (
      <AnimatedIcon style={styles.component} name="star" ref="el"
        size={STAR_SIZE}
        color={color} />
    );
  }
});

var TimerText = React.createClass({
  mixins: [
    Reflux.connect(TimerStore, 'timer')
  ],

  render() {
    var styles = {
      component: {
        fontSize: 25
      },
      subsecond: {
        fontSize: 15
      }
    };

    var currentTimeInt = this.state.timer.currentTime;
    var timeDisplay = '00:00';
    var timerMinutes = currentTimeInt / 60 >> 0;
    if(timerMinutes.toString().length === 1) timerMinutes = '0' + timerMinutes;

    var timerSeconds = currentTimeInt % 60 >> 0;
    if(timerSeconds.toString().length === 1) timerSeconds = '0' + timerSeconds;
    timeDisplay = `${timerMinutes}:${timerSeconds}`;

    var subsecond = ((currentTimeInt % 60) * 10) % 10 >> 0;
    return (
      <AppText style={styles.component}>
        {timeDisplay}
        <AppText style={styles.subsecond}>{subsecond}</AppText>
      </AppText>
    );
  }
});

export default React.createClass({
  mixins: [
    Reflux.connect(BadgeStore, 'badge'),
    Reflux.listenTo(BadgeActions.startGame, 'startGame'),
    Reflux.listenTo(BadgeActions.endGame, 'endGame'),
    Reflux.listenTo(BadgeActions.dropStar, 'dropStar'),
    Reflux.listenTo(GameActions.won, 'gameWon'),
    Reflux.connectFilter(SettingsStore, 'settings', function(settings) {
      return {
        difficulty: settings.difficulty
      };
    })
  ],

  getInitialState() {
    return {
      top: new Animated.Value(0),
      currentSlide: 0
    }
  },

  render() {
    var styles = {
      component: {
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: width,
        bottom: (height * 0.10) - (BADGE_HEIGHT / 2),
      },
      badge: {
        width: (STAR_SIZE * 3) + (BADGE_PADDING * 2),
        height: BADGE_HEIGHT,

        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: DIFFICULTY_COLORS[this.state.settings.difficulty]['400'],
        overflow: 'hidden'
      },
      slide: {
        position: 'absolute',
        width: STAR_SIZE * 3,
        height: BADGE_HEIGHT,
        top: 0,
        left: BADGE_PADDING,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      slide1: {
        top: this.state.top.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -BADGE_HEIGHT],
        })
      },
      slide2: {
        top: this.state.top.interpolate({
          inputRange: [0, 1],
          outputRange: [BADGE_HEIGHT, 0],
        })
      }
    };

    return (
      <View style={styles.component}>
        <View onPress={this.toggleSlide} underlayColor={'rgba(0, 0, 0, 0)'}>
          <View style={styles.badge}>
            <Animated.View style={[styles.slide, styles.slide1]}>
              <Star ref="star1" filled={this.state.badge.stars > 0} />
              <Star ref="star2" filled={this.state.badge.stars > 1} />
              <Star ref="star3" filled={this.state.badge.stars > 2} />
            </Animated.View>
            <Animated.View style={[styles.slide, styles.slide2]}>
              <TimerText></TimerText>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  },

  gameWon() {
    this.goToSlide(0);
    this.starsAttention();
    WonBadgeActions.show(this.state.badge.stars);
  },

  startGame() {
    this.starsAttention(() => {
      this.goToSlide(1);
    });
  },

  endGame() {
    this.goToSlide(0);
  },

  dropStar(showTimerAfter=true) {
    this.goToSlide(0, () => {
      // There was a bug in that if you win while a star was being dropped.
      // Everything goes cray.
      if(!GameStore.getInitialState().meta.won) {
        BadgeActions.set({
          stars: this.state.badge.stars - 1
        });
        this.starsAttention(() => {
          if(showTimerAfter) {
            this.goToSlide(1);
          }
        });
      }
    });
  },

  goToSlide(newCurrentSlide, callback=() => {}) {
    this.stopStarsAttention();
    if(this.state.currentSlide === newCurrentSlide) return;

    Animated.timing(this.state.top, {
      toValue: newCurrentSlide ? 1 : 0,
      duration: 500
    }).start(callback);

    this.setState({
      currentSlide: newCurrentSlide
    });
  },

  toggleSlide() {
    // this.goToSlide(this.state.currentSlide ? 0 : 1);
  },

  stopStarsAttention() {
    this.refs.star1.refs.el.stopAnimation();
    this.refs.star2.refs.el.stopAnimation();
    this.refs.star3.refs.el.stopAnimation();
  },

  starsAttention(callback=() => {}) {
    this.stopStarsAttention();
    this.refs.star1.refs.el.tada(1000).then((endState) => {
      if(endState.finished) callback();
    });
    this.refs.star2.refs.el.tada(1000);
    this.refs.star3.refs.el.tada(1000);
  }
});
