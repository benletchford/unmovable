import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import App from './src/components/App';


export default class blacksheep extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <App></App>
      </View>
    );
  }
}

AppRegistry.registerComponent('blacksheep', () => blacksheep);
