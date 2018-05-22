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
        position: 'relative',
        width: this.props.style.width,
        height: topSize * this.props.cellSize
      },
      bottom: {
        position: 'relative',
        bottom: -((hasCarpet ? 1 : 0) * this.props.cellSize),
        width: this.props.style.width,
        height: bottomSize * this.props.cellSize
      },
      carpet: {
        position: 'absolute',
        top: (topSize * this.props.cellSize),
        width: this.props.style.width,
        height: 1 * this.props.cellSize,
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
