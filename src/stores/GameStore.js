import Reflux from 'reflux';

import jsonLevels from '../data/gamesV2.json';
import { arrayToGame } from '../Prisoner';
import { GameActions, SettingsActions, TimerActions } from '../Actions';
import BadgeStore from './BadgeStore';


const DEFAULT_STATE = {
  game: arrayToGame(
    jsonLevels[0][0].game,
    jsonLevels[0][0].disabled_pieces,
    jsonLevels[0][0].reversed_pieces,
  ),
  meta: {
    difficulty: 0,
    level: 0,
    rotation: jsonLevels[0][0].rotation,
    won: false,
    stars: 0,
    paused: false,
    started: false,
    session: new Date().getTime()
  }
};

export default Reflux.createStore({
    listenables: GameActions,

    init() {
      this.state = Object.assign({}, DEFAULT_STATE);
    },

    reset(difficulty) {
      GameActions.set(this.state.meta.difficulty, this.state.meta.level);
    },

    setDifficulty(difficulty) {
      let maxUnlockedLevel = parseInt(Object.keys(BadgeStore.scores[difficulty]).slice(-1)[0]) + 1 || 0;

      if(maxUnlockedLevel >= jsonLevels[difficulty].length) {
        maxUnlockedLevel = jsonLevels[difficulty].length - 1
      }

      GameActions.set(difficulty, maxUnlockedLevel);
      SettingsActions.set('difficulty', difficulty)
    },

    nextLevel() {
      GameActions.set(this.state.meta.difficulty, this.state.meta.level + 1);
    },

    previousLevel() {
      GameActions.set(this.state.meta.difficulty, this.state.meta.level - 1);
    },

    set(difficulty, level) {
      this.state = Object.assign(DEFAULT_STATE, {
        game: arrayToGame(
          jsonLevels[difficulty][level].game,
          jsonLevels[difficulty][level].disabled_pieces,
          jsonLevels[difficulty][level].reversed_pieces,
        ),
        meta: {
          session: new Date().getTime(),
          difficulty: difficulty,
          level: level,
          rotation: jsonLevels[difficulty][level].rotation,
          paused: false,
          started: false,
          won: false
        }
      });

      this.trigger(this.state);
    },

    move(piece, cellSize, delta) {
      var steps = Math.round(delta / cellSize);
      if (steps) {
        var pieceIndex = this.state.game.pieces.indexOf(piece);
        var direction = steps > 0 ? true : false;

        this.state.game.move(pieceIndex, direction, Math.abs(steps));

      }
      this.trigger(this.state);

      SettingsActions.playSound('pieceMovement');
    },

    won() {
      this.state.meta.won = true;
      this.trigger(this.state);
    },

    getGameKey() {
      return `${this.state.meta.difficulty}-${this.state.meta.level}`;
    },

    getInitialState() {
      return this.state;
    }
});
