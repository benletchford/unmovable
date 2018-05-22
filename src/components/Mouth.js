import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
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

import Probability from '../Probability';


const {height, width} = Dimensions.get('window');

const EMOTIONS = {
  neutral: [
    {x: 290, y: 700},
    {x: 515, y: 700},
    {x: 740, y: 700}
  ],
  happy: [
    {x: 290, y: 700},
    {x: 515, y: 800},
    {x: 740, y: 700},
  ],
  worriedLeft: [
    {x: 290, y: 800},
    {x: 515, y: 750},
    {x: 740, y: 700}
  ],
  worriedRight: [
    {x: 290, y: 700},
    {x: 515, y: 750},
    {x: 740, y: 800}
  ],
  unhappy: [
    {x: 290, y: 700},
    {x: 515, y: 650},
    {x: 740, y: 700}
  ]
}

export default React.createClass({
  getInitialState() {
    return {
      animatingMouthPoints: `${EMOTIONS.neutral[0].x},${EMOTIONS.neutral[0].y} ${EMOTIONS.neutral[1].x},${EMOTIONS.neutral[1].y} ${EMOTIONS.neutral[2].x},${EMOTIONS.neutral[2].y}`,
    };
  },

  render() {
    var mouthProps = {
      fill: 'none',
      stroke: color('#FAFBFB').lighten(0.9).hexString(),
      strokeLinecap: 'round',
      strokeWidth: 1000 * 0.07,
    };
    return (
      <Polyline
        {...mouthProps}
        points={this.state.animatingMouthPoints}
      />
    );
  },

  componentDidMount() {
    this.animatingMouth = false;
    this.state.animatingMouthValue = new Animated.Value(0);
    this.animatingMouthFrom = 'neutral';
    this.animatingMouthTo = 'neutral';

    this.probabilities = [
      new Probability({
        actions: [
          {
            chance: 6,
            do: () => {
              this.setEmotion('neutral');
            }
          },
          {
            chance: 6,
            do: () => {
              this.setEmotion('happy');
            }
          },
          {
            chance: 10,
            do: () => {
              this.setEmotion('worriedRight');
            }
          },
          {
            chance: 10,
            do: () => {
              this.setEmotion('worriedLeft');
            }
          },
          {
            chance: 16,
            do: () => {
              this.setEmotion('unhappy');
            }
          },
        ]
      })
    ];
  },

  componentWillUnmount() {
    for(var i=0;i<this.probabilities.length;i++) {
      this.probabilities[i].clear();
    }
    this.state.animatingMouthValue.stopAnimation();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  },

  setEmotion(emotion) {
    if(!this.animatingMouth && emotion !== this.animatingMouthTo) {
      this.animatingMouth = true;
      this.state.animatingMouthValue = new Animated.Value(0);
      this.animatingMouthFrom = this.animatingMouthTo;
      this.animatingMouthTo = emotion;

      this.state.animatingMouthValue.addListener((a) => {
        var fromEmotion = EMOTIONS[this.animatingMouthFrom];
        var toEmotion = EMOTIONS[this.animatingMouthTo];
        var transitiveEmotion = [
          Object.assign({}, fromEmotion[0]),
          Object.assign({}, fromEmotion[1]),
          Object.assign({}, fromEmotion[2]),
        ];

        transitiveEmotion[0].y = fromEmotion[0].y + (toEmotion[0].y - fromEmotion[0].y) * a.value;
        transitiveEmotion[1].y = fromEmotion[1].y + (toEmotion[1].y - fromEmotion[1].y) * a.value;
        transitiveEmotion[2].y = fromEmotion[2].y + (toEmotion[2].y - fromEmotion[2].y) * a.value;

        this.setState({
          animatingMouthPoints: `${transitiveEmotion[0].x},${transitiveEmotion[0].y} ${transitiveEmotion[1].x},${transitiveEmotion[1].y} ${transitiveEmotion[2].x},${transitiveEmotion[2].y}`
        });
      });

      Animated.timing(this.state.animatingMouthValue, {
        toValue: 1,
        duration: 500
      }).start(() => {
        this.animatingMouth = false;
      });
    }
  }
});

const baseStyles = StyleSheet.create({
  component: {
    position: 'absolute'
  }
});
