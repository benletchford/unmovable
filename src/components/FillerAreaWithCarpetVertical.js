import React from 'react';
import {
  Text,
  View,
  Dimensions
} from 'react-native';
import Reflux from 'reflux';
import Palette from 'google-material-color/dist/palette';

import FillerArea from './FillerArea';
import Carpet from './Carpet';


export default React.createClass({
  render() {
    var hasCarpet = this.props.carpet !== undefined;

    var topSize = hasCarpet ? this.props.carpet : 0;
    var bottomSize = this.props.cellHeight - topSize - (hasCarpet ? 1 : 0);

    var styles = {
      component: Object.assign({
        position: 'absolute'
      }, this.props.style),
      top: {
        width: topSize * this.props.cellSize,
        height: this.props.style.height
      },
      bottom: {
        position: 'absolute',
        right: 0,
        width: bottomSize * this.props.cellSize,
        height: this.props.style.height
      },
      carpet: {
        position: 'absolute',
        left: (topSize * this.props.cellSize),
        width: 1 * this.props.cellSize,
        height: this.props.style.height,
      }
    };

    return (
      <View style={styles.component}>
        {(hasCarpet) ? (<Carpet style={styles.carpet}></Carpet>) : void 0}
        {(topSize === 0) ? void 0 : (
          <FillerArea
            orientation={this.props.orientation}
            style={styles.top}
            cellSize={this.props.cellSize}
            cellWidth={this.props.cellWidth}
            cellHeight={topSize}>
          </FillerArea>
        )}
        {(bottomSize === 0) ? void 0 : (
          <FillerArea
            orientation={this.props.orientation}
            style={styles.bottom}
            cellSize={this.props.cellSize}
            cellWidth={this.props.cellWidth}
            cellHeight={bottomSize}>
          </FillerArea>
        )}
      </View>
    );
  },
});
