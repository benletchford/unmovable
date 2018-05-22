import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  AppState
} from 'react-native';
import Reflux from 'reflux';
import color from 'color';
import Palette from 'google-material-color/dist/palette';
import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { shuffle, DIFFICULTY_COLORS } from '../Utilities';
import TopBar from './TopBar'
import GameGrid from './GameGrid'
import BottomBar from './BottomBar'
import AppText from './AppText';

import SettingsStore from '../stores/SettingsStore';
import TimerStore from '../stores/TimerStore';
import { MainMenuActions, SettingsActions, TimerActions } from '../Actions';


const {height, width} = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.7;
const BUTTON_HEIGHT = width * 0.15;
const ICON_HEIGHT = 35;

const CREDIT_NAMES = [
  'Braedon O',
  'Ian P',
  'Kieran P',
  'Jenna K',
  'John B'
]

var Button = React.createClass({
  render() {
    var styles = {
      component: {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        padding: 10,
        borderRadius: 10,
        backgroundColor: this.props.color,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      container: {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT + 5,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: color(this.props.color).darken(0.20).hexString(),
      },
      text: {
        fontFamily: 'Baloo Paaji',
        fontSize: 25,
        textAlign: 'center',
        color: Palette.get('White', '500')
      }
    }

    return (
      <View style={[styles.container]}>
        <TouchableHighlight style={styles.component} onPress={this.onPress} underlayColor={color(this.props.color).darken(0.2).hexString()}>
          <Text style={styles.text}>{this.props.title}</Text>
        </TouchableHighlight>
      </View>
    );
  },

  onPress() {
    SettingsActions.playSound('click');
    this.props.onPress();
  }
});

export default React.createClass({
  mixins: [
    Reflux.connect(SettingsStore, 'settings'),
    Reflux.connect(TimerStore, 'timer'),
    Reflux.listenTo(MainMenuActions.hide, 'hide'),
    Reflux.listenTo(MainMenuActions.show, 'show')
  ],

  render() {
    var styles = {
      component: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)'
      },
      slide: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 145,
        backgroundColor: color(DIFFICULTY_COLORS[this.state.settings.difficulty]['500']).alpha(0.9).rgbaString(),
      },
      slideTitle: {
        position: 'absolute',
        fontSize: 45,
        width: width,
        top: 40,
      },
      exitButton: {
        position: 'absolute',
        top: 10,
        right: 10
      },
      text: {
        fontSize: 30,
      }
    }

    var creditNames = [];
    for(var i=0;i<CREDIT_NAMES.length;i++) {
      creditNames.push(
        // <AppText key={i} style={[styles.text, {fontSize: 20}]}>{CREDIT_NAMES[i]}</AppText>
        CREDIT_NAMES[i]
      );
    }
    creditNames = shuffle(creditNames);
    creditNames = creditNames.join(', ');

    return (
      <Modal ref={"el"} style={styles.component}
        swipeToClose={false}
        startOpen={true}
        animationDuration={0}
        entry={'top'}>
        <Swiper ref={"swiper"} style={styles.wrapper}
          showsButtons={false}
          showsPagination={false}
          loop={false}>
          <View style={styles.slide}>
            <AppText style={styles.slideTitle}>Unmovable</AppText>

            <Button color={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']} title={this.state.timer.paused ? 'Resume' : 'Play'} cellSize={this.props.cellSize} onPress={MainMenuActions.hide}></Button>
            <Button color={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']} title="Settings" cellSize={this.props.cellSize} onPress={() => {this.refs.swiper.scrollBy(1)}}></Button>
            <Button color={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']} title="Credits" cellSize={this.props.cellSize} onPress={() => {this.refs.swiper.scrollBy(2)}}></Button>
          </View>
          <View style={styles.slide}>
            <Icon style={styles.exitButton}
              size={ICON_HEIGHT}
              name="clear"
              color={Palette.get('White', '500')}
              onPress={() => {this.refs.swiper.scrollBy(-1)}}></Icon>
            <AppText style={styles.slideTitle}>Settings</AppText>

            <Button color={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']} title={'Music ' + (this.state.settings.music ? 'On' : 'Off')} cellSize={this.props.cellSize} onPress={() => {SettingsActions.toggle('music')}}></Button>
            <Button color={DIFFICULTY_COLORS[this.state.settings.difficulty]['700']} title={'Sound ' + (this.state.settings.sound ? 'On' : 'Off')} onPress={() => {SettingsActions.toggle('sound')}}></Button>
          </View>
          <View style={styles.slide}>
            <Icon style={styles.exitButton}
              size={ICON_HEIGHT}
              name="clear"
              color={Palette.get('White', '500')}
              onPress={() => {this.refs.swiper.scrollBy(-2)}}></Icon>
            <AppText style={styles.slideTitle}>Credits</AppText>

            <AppText style={styles.text}>App By</AppText>
            <AppText style={[styles.text, {fontSize: 20}]}>Ben Letchford</AppText>
            <AppText style={styles.text}>With Thanks To</AppText>
            <AppText style={[styles.text, {fontSize: 20}]}>{creditNames}</AppText>
          </View>
        </Swiper>
      </Modal>
    );
  },
  //             <Button title="Help" cellSize={this.props.cellSize} onPress={() => {this.refs.swiper.scrollBy(2)}}></Button>

  // <View style={styles.slide}>
  //   <Icon style={styles.exitButton}
  //     size={ICON_HEIGHT}
  //     name="clear"
  //     color={Palette.get('White', '500')}
  //     onPress={() => {this.refs.swiper.scrollBy(-2)}}></Icon>
  //   <AppText style={styles.slideTitle}>Help</AppText>
  //
  // </View>

  //             <Button title={'Faces ' + (this.state.settings.faces ? 'On' : 'Off')} onPress={() => {SettingsActions.toggle('faces')}}></Button>

  hide() {
    TimerActions.resume();
    this.refs.el.close();
  },

  show() {
    TimerActions.pause();
    this.refs.el.open();
  },

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  },

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  },

  _handleAppStateChange(currentAppState) {
    if(currentAppState !== 'active') {
      MainMenuActions.show();
      SettingsActions.stopMusic();
    } else {
      SettingsActions.playMusic();
    }
  }
});
