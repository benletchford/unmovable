import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
import Reflux from 'reflux';
import color from 'color';
import Palette from 'google-material-color/dist/palette';

import Svg, {
  Rect
} from 'react-native-svg';

import { shuffle } from '../Utilities';
import { Piece } from '../Prisoner';


const PIECES = [
  new Piece(
    {x: 0, y: 0},
    {x: 1, y: 0}
  ),
  new Piece(
    {x: 0, y: 0},
    {x: 2, y: 0}
  ),
  new Piece(
    {x: 0, y: 0},
    {x: 0, y: 1}
  ),
  new Piece(
    {x: 0, y: 0},
    {x: 0, y: 2}
  )
];

const CELLS_THAT_NEED_TO_BE_EMPTY = [
  [
    {x: 0, y: 0},
    {x: 1, y: 0}
  ],
  [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 2, y: 0}
  ],
  [
    {x: 0, y: 0},
    {x: 0, y: 1}
  ],
  [
    {x: 0, y: 0},
    {x: 0, y: 1},
    {x: 0, y: 2}
  ]
];


var FillerPiece = React.createClass({
  render() {
    var pieceColor = Palette.get('Grey', '400');

    var styles = {
      component: {
        position: 'absolute',
        opacity: 1,
        zIndex: 0,
        backgroundColor: pieceColor,
        borderBottomWidth: this.props.cellSize * 0.10,
        borderBottomColor: color(pieceColor).darken(0.1).hexString()
      }
    };

    var begin = JSON.parse(JSON.stringify(this.props.piece.begin));
    var end = JSON.parse(JSON.stringify(this.props.piece.end));

    if (this.props.piece.horizontal) {
      Object.assign(styles.component, {
        top: this.props.parentProps.cellSize * begin.y,
        left: this.props.parentProps.cellSize * begin.x,
        width: this.props.parentProps.cellSize * (end.x - begin.x) + this.props.parentProps.cellSize,
        height: this.props.parentProps.cellSize
      });
    } else {
      Object.assign(styles.component, {
        top: this.props.parentProps.cellSize * begin.y,
        left: this.props.parentProps.cellSize * begin.x,
        width: this.props.parentProps.cellSize,
        height: this.props.parentProps.cellSize * (end.y - begin.y) + this.props.parentProps.cellSize
      });
    }

    if(this.props.parentProps.orientation === 2 || this.props.parentProps.reverseBoth) {
      Object.assign(styles.component, {
        left: this.props.parentProps.style.width - (this.props.parentProps.cellSize * (end.x + 1)),
      });
    }
    if(this.props.parentProps.orientation === 3 || this.props.parentProps.reverseBoth) {
      Object.assign(styles.component, {
        top: this.props.parentProps.style.height - (this.props.parentProps.cellSize * (end.y + 1)),
      });
    }

    // Add padding
    var piecePadding = 1;
    styles.component.left += piecePadding;
    styles.component.width -= (piecePadding * 2);
    styles.component.top += piecePadding;
    styles.component.height -= (piecePadding * 2);

    return (
      <View
        style={[styles.component]}>
        <Svg style={{width: styles.component.width, height: styles.component.height}}>
          <Rect
            x="0"
            y="0"
            width="50%"
            height={styles.component.height - styles.component.borderBottomWidth}
            fill={color(pieceColor).lighten(0.03).hexString()}
          />
        </Svg>
      </View>
    )
  },
});

export default React.createClass({
  getDefaultProps() {
    return {
      style: {}
    };
  },

  render() {
    var styles = {
      component: {
        position: 'absolute',
      }
    };

    if (this.props.orientation % 2 === 0) {
      var cellsX = this.props.cellWidth;
      var cellsY = this.props.cellHeight;
    } else {
      var cellsX = this.props.cellHeight;
      var cellsY = this.props.cellWidth;
    }

    if(cellsX <= 0) cellsX = 1;
    if(cellsY <= 0) cellsY = 1;

    var matrix = [];
    for(var y=0;y<cellsY;y++) {
      matrix.push(new Uint8Array(cellsX));
    }

    var matrixPieces = [];
    var currentPieceNumber = 1;
    var total = cellsX*cellsY;

    var horizontalPlacement = this.props.orientation === 1 || this.props.orientation === 3;
    var firstTotal = null;
    var secondTotal = null;
    if(horizontalPlacement) {
      firstTotal = cellsY;
      secondTotal = cellsX;
    } else {
      firstTotal = cellsX;
      secondTotal = cellsY;
    }
    for(var first=0;first<firstTotal;first++) {
      for(var second=0;second<secondTotal;second++) {
        var cellsThatNeedToBeEmpty = JSON.parse(JSON.stringify(CELLS_THAT_NEED_TO_BE_EMPTY));

        for(var i=0;i<CELLS_THAT_NEED_TO_BE_EMPTY.length;i++) {
          for(var j=0;j<CELLS_THAT_NEED_TO_BE_EMPTY[i].length;j++) {
            cellsThatNeedToBeEmpty[i][j].x += horizontalPlacement ? second : first;
            cellsThatNeedToBeEmpty[i][j].y += horizontalPlacement ? first : second;
          }
        }

        cellsThatNeedToBeEmpty = shuffle(cellsThatNeedToBeEmpty);

        for(var i=0;i<cellsThatNeedToBeEmpty.length;i++) {
          var willFit = true;
          for(var j=0;j<cellsThatNeedToBeEmpty[i].length;j++) {
            if(matrix[cellsThatNeedToBeEmpty[i][j].y] === undefined
                || matrix[cellsThatNeedToBeEmpty[i][j].y][cellsThatNeedToBeEmpty[i][j].x] === undefined
                || matrix[cellsThatNeedToBeEmpty[i][j].y][cellsThatNeedToBeEmpty[i][j].x] !== 0
              ) {
              willFit = false;
              break;
            }
          }

          if(willFit) {
            for(var j=0;j<cellsThatNeedToBeEmpty[i].length;j++) {
              matrix[cellsThatNeedToBeEmpty[i][j].y][cellsThatNeedToBeEmpty[i][j].x] = currentPieceNumber;
            }

            matrixPieces.push(new Piece(
              cellsThatNeedToBeEmpty[i][0],
              cellsThatNeedToBeEmpty[i].slice(-1)[0]
            ));

            currentPieceNumber += 1;
            break;
          }
        }
      }
    }

    var pieces = [];
    for(var i=0;i<matrixPieces.length;i++) {
      pieces.push(
        <FillerPiece key={i} piece={matrixPieces[i]} parentProps={this.props} cellSize={this.props.cellSize} cellsX={cellsX} cellsY={cellsY}></FillerPiece>
      );
    }
    return (
      <View style={[styles.component, this.props.style]}>
        {pieces}
      </View>
    );
  },

  shouldComponentUpdate(nextProps) {
    if(nextProps.cellSize === this.props.cellSize
      && nextProps.style.width === this.props.style.width
      && nextProps.style.height === this.props.style.height
      && nextProps.style.left === this.props.style.left
      && nextProps.style.left === this.props.style.left
      && nextProps.style.top === this.props.style.top
    ) return false;
    else return true
  }
});
