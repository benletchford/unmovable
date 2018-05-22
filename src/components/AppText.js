import React, { Component } from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import color from 'color';
import Palette from 'google-material-color/dist/palette';

export default React.createClass({
  render() {

    return (
      <Text style={[baseStyles.component, this.props.style]}>{this.props.children}</Text>
    );
  }
});

const baseStyles = StyleSheet.create({
  component: {
    fontFamily: 'Baloo Paaji',
    // fontWeight: 'bold',
    textAlign: 'center',
    color: Palette.get('White', '500')
  }
});
