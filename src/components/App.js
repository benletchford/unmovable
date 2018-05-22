import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import Reflux from 'reflux';
import Palette from 'google-material-color/dist/palette';
import Modal from 'react-native-modalbox';
import Sound from 'react-native-sound';
import SplashScreen from 'react-native-splash-screen'

import TopBar from './TopBar'
import GameGrid from './GameGrid'
import BottomBar from './BottomBar'
import MainMenu from './MainMenu'
import ScoreBadge from './ScoreBadge';
import WonBadge from './WonBadge';
import FillerArea from './FillerArea';
import FillerAreaWithCarpetHorizontal from './FillerAreaWithCarpetHorizontal';
import FillerAreaWithCarpetVertical from './FillerAreaWithCarpetVertical';

import GameStore from '../stores/GameStore'
import SettingsStore from '../stores/SettingsStore'
import BadgeStore from '../stores/BadgeStore'


const {height, width} = Dimensions.get('window');
const gameMargin = width * 0.05;

export default React.createClass({
  mixins: [
    Reflux.connect(GameStore, 'game')
  ],

  componentDidMount() {
    Promise.all([SettingsStore.loaded, BadgeStore.loaded])
      .then(() => {
        SplashScreen.hide();
      })
      .catch(() => {
        SplashScreen.hide();
      })
  },

  render() {
    var cellSize = (width - gameMargin) / this.state.game.game.width >> 0;
    var gameHeight = this.state.game.game.height * cellSize;
    var gameWidth = this.state.game.game.width * cellSize;
    var gameHorizontalGap = (width - gameWidth) / 2
    var gameVerticalGap = (height - gameHeight) / 2

    var carpet = this.state.game.game.pieces[0].horizontal ? this.state.game.game.pieces[0].begin.y : this.state.game.game.pieces[0].begin.x;
    return (
      <View style={styles.component}>
        <FillerArea
          orientation={3}
          style={{
            width: gameHorizontalGap,
            height: gameVerticalGap,
            top: 0,
            left: gameHorizontalGap + gameWidth
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={Math.ceil(gameVerticalGap / cellSize) + 1}>
        </FillerArea>
        <FillerArea
          orientation={2}
          reverseBoth={true}
          style={{
            width: gameHorizontalGap,
            height: gameVerticalGap,
            top: 0,
            left: 0
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={Math.ceil(gameVerticalGap / cellSize) + 1}>
        </FillerArea>
        <FillerArea
          orientation={2}
          style={{
            width: gameHorizontalGap,
            height: gameVerticalGap,
            top: gameVerticalGap + gameHeight,
            left: 0
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={Math.ceil(gameVerticalGap / cellSize) + 1}>
        </FillerArea>
        <FillerArea
          orientation={0}
          style={{
            width: gameHorizontalGap,
            height: gameVerticalGap,
            top: gameVerticalGap + gameHeight,
            left: gameHorizontalGap + gameWidth
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={Math.ceil(gameVerticalGap / cellSize) + 1}>
        </FillerArea>

        <FillerAreaWithCarpetHorizontal
          carpet={this.state.game.meta.rotation === 0 ? carpet : undefined}
          orientation={0}
          style={{
            width: gameHorizontalGap,
            height: gameHeight,
            left: gameWidth + gameHorizontalGap
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={this.state.game.game.height}>
        </FillerAreaWithCarpetHorizontal>
        <FillerAreaWithCarpetVertical
          carpet={this.state.game.meta.rotation === 1 ? carpet : undefined}
          orientation={1}
          style={{
            width: gameWidth,
            height: gameVerticalGap,
            top: gameHeight + gameVerticalGap,
            left: gameHorizontalGap
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameVerticalGap / cellSize) + 1}
          cellHeight={this.state.game.game.width}>
        </FillerAreaWithCarpetVertical>
        <FillerAreaWithCarpetHorizontal
          carpet={this.state.game.meta.rotation === 2 ? carpet : undefined}
          orientation={2}
          style={{
            width: gameHorizontalGap,
            height: gameHeight,
            left: 0
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameHorizontalGap / cellSize) + 1}
          cellHeight={this.state.game.game.height}>
        </FillerAreaWithCarpetHorizontal>
        <FillerAreaWithCarpetVertical
          carpet={this.state.game.meta.rotation === 3 ? carpet : undefined}
          orientation={3}
          style={{
            width: gameWidth,
            height: gameVerticalGap,
            top: 0,
            left: gameHorizontalGap
          }}
          cellSize={cellSize}
          cellWidth={Math.ceil(gameVerticalGap / cellSize) + 1}
          cellHeight={this.state.game.game.width}>
        </FillerAreaWithCarpetVertical>
        <GameGrid
          key={`${this.state.game.meta.session}`}
          game={this.state.game}
          cellSize={cellSize}>
        </GameGrid>

        <TopBar></TopBar>
        <BottomBar></BottomBar>
        <ScoreBadge></ScoreBadge>
        <WonBadge></WonBadge>

        <MainMenu cellSize={cellSize}></MainMenu>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  component: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.get('Grey', '500')
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.get('Indigo', '500')
  }
});
