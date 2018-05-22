import React, { Component } from 'react';
import Reflux from 'reflux';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import color from 'color';
import Palette from 'google-material-color/dist/palette';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import { DIFFICULTY_COLORS } from '../Utilities';
import { GameActions, BadgeActions } from '../Actions';
import GameStore from '../stores/GameStore';
import SettingsStore from '../stores/SettingsStore';
import BadgeStore from '../stores/BadgeStore'
import AppText from './AppText';

import jsonLevels from '../data/gamesV2.json';


const {height, width} = Dimensions.get('window');
const AnimatedIcon = Animatable.createAnimatableComponent(Icon);
const COMPONENT_HEIGHT = height * 0.12;
const DIFFICULTY_SELECTION_HEIGHT = COMPONENT_HEIGHT * 0.5;
const LEVEL_SELECTION_HEIGHT = COMPONENT_HEIGHT * 0.7;
const ICON_HEIGHT = LEVEL_SELECTION_HEIGHT * 0.9;

const DIFFICULTY_TEXT = [
  'Easy',
  'Medium',
  'Hard'
];

let RightButton = React.createClass({
  mixins: [
    Reflux.listenTo(GameActions.won, 'forceUpdate')
  ],

  render() {
    let lockSize = ICON_HEIGHT / 1.5;
    let disabled = jsonLevels[this.props.difficulty][this.props.level + 1] ? false : true;
    let maxUnlockedLevel = parseInt(Object.keys(BadgeStore.scores[this.props.difficulty]).slice(-1)[0]) + 1;
    let nextLevelUnlocked = maxUnlockedLevel > this.props.level;
    // let nextLevelUnlocked = true;

    let lock = (
      <AnimatedIcon
        style={{
          right: -(ICON_HEIGHT - lockSize) / 2
        }}
        name="lock"
        ref="lock"
        size={lockSize}
        color={Palette.get('White', '500')}
        onPress={() => {this.refs.lock.flash();}} />
    );
    let rightButton = (
      <Icon
        name="navigate-next"
        size={ICON_HEIGHT}
        color={disabled ? Palette.get('Grey', '500') : Palette.get('White', '500')}
        onPress={disabled ? void 0 : this.props.onPress} />
    );

    return (
      <View style={[this.props.style, {width: ICON_HEIGHT}]}>
        {nextLevelUnlocked ? rightButton : lock}
      </View>
    );
  }
});

let LeftButton = React.createClass({
  render() {
    let disabled = this.props.level === 0 ? true : false;

    return (
      <Icon
        style={this.props.style}
        name="chevron-left"
        size={ICON_HEIGHT}
        color={disabled ? Palette.get('Grey', '500') : Palette.get('White', '500')}
        onPress={disabled ? void 0 : this.props.onPress} />
    );
  }
});

export default React.createClass({
  mixins: [
    Reflux.connect(GameStore, 'game'),
    Reflux.connectFilter(SettingsStore, 'settings', function(settings) {
      return {
        difficulty: settings.difficulty
      };
    })
  ],

  render() {
    var styles = {
      component: {
        position: 'absolute',
        top: 0
      },
      difficultySelection: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',

        width: width,
        height: DIFFICULTY_SELECTION_HEIGHT,
        top: 0,
        backgroundColor: DIFFICULTY_COLORS[this.state.settings.difficulty]['400'],
      },
      difficultyButton: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        height: DIFFICULTY_SELECTION_HEIGHT,
        // backgroundColor: Palette.get('Indigo', '400'),
      },
      difficultyText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Baloo Paaji',
        color: Palette.get('White', '500')
      },
      levelSelection: {
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        width: width,
        height: LEVEL_SELECTION_HEIGHT,
        top: DIFFICULTY_SELECTION_HEIGHT,
        backgroundColor: DIFFICULTY_COLORS[this.state.settings.difficulty]['500'],
      },
      levelTitle: {
        fontSize: LEVEL_SELECTION_HEIGHT * 0.5,
      },
      leftButton: {},
      rightButton: {}
    }

    var difficultyButtons = [];
    DIFFICULTY_TEXT.forEach((text, i) => {
      difficultyButtons.push(
        <TouchableHighlight
          underlayColor={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']}
          activeOpacity={1}
          key={i}
          onPress={function(){GameActions.setDifficulty(i)}}
          style={[styles.difficultyButton, Object.assign({}, {
            backgroundColor: i === +this.state.game.meta.difficulty ? DIFFICULTY_COLORS[this.state.settings.difficulty]['500'] : DIFFICULTY_COLORS[this.state.settings.difficulty]['400']
          })]}>
          <Text style={styles.difficultyText}>{DIFFICULTY_TEXT[i]}</Text>
        </TouchableHighlight>
      );
    });
    return (
      <View style={styles.component}>
        <View style={styles.levelSelection}>
          <LeftButton
            style={styles.leftButton}
            difficulty={this.state.game.meta.difficulty}
            level={this.state.game.meta.level}
            onPress={GameActions.previousLevel} />

          <AppText style={styles.levelTitle}>#{this.state.game.meta.level + 1}</AppText>

          <RightButton
            style={styles.rightButton}
            difficulty={this.state.game.meta.difficulty}
            level={this.state.game.meta.level}
            onPress={GameActions.nextLevel} />
        </View>

        <View style={styles.difficultySelection}>
          {difficultyButtons}
        </View>
      </View>
    );
  }
});
