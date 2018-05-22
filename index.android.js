import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './src/components/App';


export default class blacksheep extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <App></App>
      </View>
    );
  }
}

AppRegistry.registerComponent('blacksheep', () => blacksheep);
