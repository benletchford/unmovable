import React, { Component } from 'react';
import Reflux from 'reflux';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Palette from 'google-material-color/dist/palette';
import * as Animatable from 'react-native-animatable';

import Piece from './Piece';

import GameStore from '../stores/GameStore'
import SettingsStore from '../stores/SettingsStore';


const AnimatedView = Animatable.createAnimatableComponent(View);

export default React.createClass({
  mixins: [
    Reflux.connect(SettingsStore, 'settings'),
  ],

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  render() {
    var size = this.props.cellSize * this.props.game.game.width;

    var styles = StyleSheet.create({
      component: {
        height: size,
        width: size
      }
    });

    var pieces = [];
    this.props.game.game.pieces.map((piece, i) => {
      var prisoner = (i===0) ? true : false;
      pieces.push(
        <Piece key={i} face={this.state.settings.faces} rotation={this.props.game.rotation} game={this.props.game} disabled={this.props.disabled} piece={piece} cellSize={this.props.cellSize} prisoner={prisoner}></Piece>
      );
    });
    return (
      <AnimatedView ref="el" style={[baseStyles.component, styles.component]}>
        {pieces}
      </AnimatedView>
    );
  },

  componentDidMount() {
    this.refs.el.bounceIn();
  },
});

const baseStyles = StyleSheet.create({
  component: {
    backgroundColor: '#7D8DAA'
  }
});
