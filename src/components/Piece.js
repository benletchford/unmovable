import React, { Component } from 'react';
import Reflux from 'reflux';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder,
  Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import color from 'color';
import Palette from 'google-material-color/dist/palette';

import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

import Face from './Face';
import SettingsStore from '../stores/SettingsStore';
import { GameActions, SettingsActions } from '../Actions';

const AnimatedView = Animatable.createAnimatableComponent(View);
const PIECE_PADDING = 1;
const {height, width} = Dimensions.get('window');

export default React.createClass({
  mixins: [
    // Reflux.listenTo(GameActions.won, 'won')
  ],

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  getInitialState() {
    return {
      // pan: new Animated.ValueXY()
    };
  },

  render() {
    var pieceColor = "#82CCC7";
    if(this.props.prisoner) {
      pieceColor = color(Palette.get('Red', '500')).lighten(0.05).hexString();
    } else if(this.props.piece.disabled) {
      pieceColor = color('#AAA').darken(0.3).hexString();
    } else if(this.props.piece.reversed) {
      pieceColor = Palette.get('Purple', '500');
    }
    var mirrorPieceColor = color(pieceColor).lighten(0.07).hexString();
    var borderColor = color(pieceColor).darken(0.20).hexString();

    var styles = {
      component: {
        backgroundColor: pieceColor,
        borderBottomWidth: this.props.cellSize * 0.10,
        borderBottomColor: borderColor
      }
    };

    if (this.props.piece.horizontal) {
      Object.assign(styles.component, {
        width: this.props.cellSize * (this.props.piece.end.x - this.props.piece.begin.x) + this.props.cellSize,
        height: this.props.cellSize
      });
    } else {
      Object.assign(styles.component, {
        height: this.props.cellSize * (this.props.piece.end.y - this.props.piece.begin.y) + this.props.cellSize,
        width: this.props.cellSize
      });
    }
    styles.component.width -= (PIECE_PADDING * 2);
    styles.component.height -= (PIECE_PADDING * 2);

    Object.assign(styles.component, {
      left: this.props.cellSize * this.props.piece.begin.x + PIECE_PADDING,
      top: this.props.cellSize * this.props.piece.begin.y + PIECE_PADDING
    });

    if(this.props.prisoner && this.props.game.meta.won) {
      if(Platform.OS === 'ios') {
        this._animating = true;
        this._animatedMovement = new Animated.Value(styles.component[this._movementKind]);
        Animated.timing(this._animatedMovement, {
          toValue: this.exitPosition,
          duration: 1000
        }).start(() => {this._animating = false;})

        styles.component[this._movementKind] = this._animatedMovement;
      } else {
        setTimeout(() => {
          this.el.fadeOut()
        }, 0)
      }
    } else if(this.nativePropsSet) {
      this._animating = true;
      this._animatedMovement = new Animated.Value(this._previous);
      Animated.timing(this._animatedMovement, {
        toValue: styles.component[this._movementKind],
        duration: 100
      }).start(() => {this._animating = false;})

      styles.component[this._movementKind] = this._animatedMovement;

      this.nativePropsSet = false;
    }

    var optionalProps = {};
    if(!this.props.piece.disabled) Object.assign(optionalProps, this._panResponder.panHandlers);
    return (
      <AnimatedView
        ref={(el) => {
          this.el = el;
        }}
        style={[baseStyles.component, styles.component]}
        {...optionalProps}>
        <Svg style={{width: styles.component.width, height: styles.component.height}}>
          <Rect
            x="0"
            y="0"
            width="50%"
            height={styles.component.height - styles.component.borderBottomWidth}
            fill={mirrorPieceColor}
          />
        </Svg>
        {this.props.piece.disabled || !this.props.face ? (void 0) : <Face cellSize={this.props.cellSize} parentSize={{width: styles.component.width, height: styles.component.height}}></Face>}
      </AnimatedView>
    );
  },

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });

    this._movementKind = this.props.piece.horizontalMovement ? 'left' : 'top';
    this._animating = false;

    // Native props set outside render?
    this.nativePropsSet = false;

    // Calculate exit position
    if(this.props.prisoner) {
      var gameHeight = this.props.game.game.height * this.props.cellSize;
      var gameWidth = this.props.game.game.width * this.props.cellSize;
      // var gameHorizontalGap = (width - gameWidth) / 2;
      // var gameVerticalGap = (height - gameHeight) / 2;

      var gap = this.props.piece.horizontalMovement ? (width - gameWidth) / 2 : (height - gameHeight) / 2;
      this.exitPosition = -(this.props.cellSize * 2 + gap);
      if(this.props.game.meta.rotation === 0) {
        this.exitPosition = width;
      } else if(this.props.game.meta.rotation === 1) {
        this.exitPosition = height;
      }
    }
  },

  // componentDidMount() {
  //   if(this.props.prisoner) {
  //     setTimeout(() => {
  //       GameActions.won();
  //     }, 1000);
  //   }
  // },

  shouldComponentUpdate(nextProps, nextState) {
    if(this.nativePropsSet || (
      nextProps.piece.begin.x !== this.props.piece.begin.x ||
      nextProps.piece.begin.y !== this.props.piece.begin.y ||
      nextProps.piece.end.x !== this.props.piece.end.x ||
      nextProps.piece.end.y !== this.props.piece.end.y
    ) || nextProps.face !== this.props.face
      || (this.props.prisoner && this.props.game.meta.won)) return true;
    else return false;
  },

  _updateNativeProps: function() {
    this.el.setNativeProps(this._nativeProps);
    this.nativePropsSet = true;
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down?
    return !this._animating && !this.props.game.meta.won ? true : false;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return !this._animating && !this.props.game.meta.won ? true : false;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    if(!this.props.game.meta.won) {
      this._nativeProps = {
        style: {
          left: this.props.cellSize * this.props.piece.begin.x + PIECE_PADDING,
          top: this.props.cellSize * this.props.piece.begin.y + PIECE_PADDING
        }
      };
      this._previous = this._nativeProps.style[this._movementKind];
      this._highlight();
    }
  },

  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    if(!this.props.game.meta.won) {
      var maxPositive = this.props.cellSize;
      var minNegative = this.props.cellSize;
      if(this.props.piece.horizontalMovement) {
        maxPositive *= this.props.piece.movement.right;
        minNegative *= -this.props.piece.movement.left;
      } else {
        maxPositive *= this.props.piece.movement.down;
        minNegative *= -this.props.piece.movement.up;
      }

      this._delta = gestureState[`d${this.props.piece.horizontalMovement ? 'x' : 'y'}`];

      if(this._delta > maxPositive) {
        this._delta = maxPositive;
      } else if(this._delta < minNegative) {
        this._delta = minNegative;
      }

      if(this.props.prisoner) {
        var exitTest = false;
        if(this.props.game.meta.rotation === 0) {
          exitTest = ((this.props.piece.end.x + 1) * this.props.cellSize + this._delta) >= this.props.cellSize * this.props.game.game.width - 1;
        } else if(this.props.game.meta.rotation === 1) {
          exitTest = ((this.props.piece.end.y + 1) * this.props.cellSize + this._delta) >= this.props.cellSize * this.props.game.game.height - 1;
        } else if(this.props.game.meta.rotation === 2) {
          exitTest = ((this.props.piece.begin.x) * this.props.cellSize + this._delta) <= 0;
        } else if(this.props.game.meta.rotation === 3) {
          exitTest = ((this.props.piece.begin.y) * this.props.cellSize + this._delta) <= 0;
        }
        if(exitTest) {
          // this._nativeProps.style[this._movementKind] = this._previous + this._delta;
          // this._updateNativeProps();
          this._handlePanResponderEnd();
          e.preventDefault();
          GameActions.won();
          return false;
        }
      }
      this._nativeProps.style[this._movementKind] = this._previous + this._delta;
      this._updateNativeProps();
    }
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    if(!this.props.game.meta.won) {
      this._unHighlight();

      if(this._delta) {
        this._previous = this._nativeProps.style[this._movementKind];
        if(!this.props.game.meta.won) {
          var maxPositive = this.props.cellSize;
          var minNegative = this.props.cellSize;
          if(this.props.piece.horizontalMovement) {
            maxPositive *= this.props.piece.movement.right;
            minNegative *= -this.props.piece.movement.left;
          } else {
            maxPositive *= this.props.piece.movement.down;
            minNegative *= -this.props.piece.movement.up;
          }

          if(this._delta > maxPositive) {
            this._delta = maxPositive;
          } else if(this._delta < minNegative) {
            this._delta = minNegative;
          }

          GameActions.move(this.props.piece, this.props.cellSize, this._delta);
        }

        this._delta = undefined;
      }
    }
  },
  _highlight() {
    this._nativeProps.style.opacity = 0.8;
    this._updateNativeProps();
  },
  _unHighlight() {
    this._nativeProps.style.opacity = 1;
    this._updateNativeProps();
  }
});

const baseStyles = StyleSheet.create({
  component: {
    position: 'absolute'
  }
});
