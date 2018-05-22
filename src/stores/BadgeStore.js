import Reflux from 'reflux';
import { AsyncStorage } from 'react-native';

import GameStore from '../stores/GameStore';
import TimerStore from '../stores/TimerStore';
import { calculateStars } from '../Utilities';
import { TimerActions, GameActions, BadgeActions } from '../Actions';


const DEFAULT_STATE = {
  stars: 0
};

export default Reflux.createStore({
    listenables: BadgeActions,

    init() {
      this.listenTo(GameActions.won, this.gameWon);

      this.scores = {
        0: {},
        1: {},
        2: {},
        3: {}
      };
      this.state = Object.assign({}, DEFAULT_STATE);

      // this.loaded = AsyncStorage.removeItem('BadgeStore:scores');
      this.loaded = AsyncStorage.getItem('BadgeStore:scores');
      this.loaded.then((storedScores) => {
        if (storedScores) {
          storedScores = JSON.parse(storedScores);
          this.scores = Object.assign({}, storedScores);
        }

        var currentGame = GameStore.getInitialState();
        if(this.scores[currentGame.meta.difficulty][currentGame.meta.level] !== undefined) {
          BadgeActions.set({
            stars: calculateStars(
              currentGame.meta.difficulty,
              currentGame.meta.level,
              this.scores[currentGame.meta.difficulty][currentGame.meta.level].totalTime
            )
          });
        }
      });
    },

    gameWon() {
      TimerStore.pause();

      var currentGame = GameStore.getInitialState();
      this.scores[currentGame.meta.difficulty][currentGame.meta.level] = {
        totalTime: TimerStore.getInitialState().totalTime
      };

      AsyncStorage.setItem('BadgeStore:scores', JSON.stringify(this.scores));

      BadgeActions.setObtainedStars();
    },

    set(data) {
      this.state = Object.assign({}, this.state, data);
      this.trigger(this.state);
    },

    setObtainedStars() {
      var currentGame = GameStore.getInitialState();
      if(this.scores[currentGame.meta.difficulty][currentGame.meta.level]) {
        BadgeActions.set({
          stars: calculateStars(
            currentGame.meta.difficulty,
            currentGame.meta.level,
            this.scores[currentGame.meta.difficulty][currentGame.meta.level].totalTime
          )
        });
      } else {
        BadgeActions.set({
          stars: 0
        });
      }
    },

    getInitialState() {
      return this.state;
    }
});
