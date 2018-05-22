import Reflux from 'reflux';
import GameStore from '../stores/GameStore';
import { IntervalTimer, calculateStarTimes } from '../Utilities';
import { TimerActions, GameActions, BadgeActions } from '../Actions';


const DEFAULT_STATE = {
  currentTime: 0,
  totalTime: 0,
  stars: 3,
  difficulty: 0,
  level: 0,
  paused: false
};

export default Reflux.createStore({
    listenables: TimerActions,

    init() {
      this.listenTo(GameActions.set, this.gameSet);
      this.listenTo(GameActions.move, this.gameMove);
      // this.listenTo(GameActions.won, this.gameWon);

      this.state = Object.assign({}, DEFAULT_STATE);
      this.timer = null;
    },

    set({difficulty, level}, start=true) {
      Object.assign(this.state, DEFAULT_STATE, {
        difficulty: difficulty,
        level: level,
        currentTime: calculateStarTimes(difficulty, level)[3]
      });

      if(start) {
        this.timer = new IntervalTimer(TimerActions.tick, 100);
        BadgeActions.set({stars: 3});
        BadgeActions.startGame();
      } else {
        BadgeActions.setObtainedStars();
        BadgeActions.endGame();
      }

      this.trigger(this.state);
    },

    gameSet() {
      TimerActions.destroy();

      // The clearInterval seems to be async?
      setTimeout(function() {
        var currentGame = GameStore.getInitialState();

        TimerActions.set({
          difficulty: currentGame.meta.difficulty,
          level: currentGame.meta.level
        }, false);
      }, 0);
    },

    gameMove() {
      if(!this.timer) {
        var currentGame = GameStore.getInitialState();

        TimerActions.set({
          difficulty: currentGame.meta.difficulty,
          level: currentGame.meta.level
        });
      }
    },

    gameWon() {
      TimerActions.pause();
    },

    tick() {
      // if(!this.state.paused) {
      this.state.totalTime += 0.1;
      if(this.state.currentTime>0) {
        this.state.currentTime -= 0.1;
        this.state.currentTime = this.state.currentTime.toFixed(1);
        this.trigger(this.state);
      } else if(this.state.stars !== 1) {
        this.state.stars -= 1;

        if(this.state.stars === 2) {
          BadgeActions.dropStar();
          this.state.currentTime = calculateStarTimes(this.state.difficulty, this.state.level)[this.state.stars];
          this.trigger(this.state);
        } else {
          BadgeActions.dropStar(false);
        }
      }
      // }
    },

    pause() {
      if(this.timer) {
        this.timer.pause();

        this.state.paused = true;
        this.trigger(this.state);
      }
    },

    resume() {
      if(this.timer) {
        this.timer.resume();

        this.state.paused = false;
        this.trigger(this.state);
      }
    },

    destroy() {
      if(this.timer) {
        this.timer.destroy();
        this.timer = null;
      }
    },

    getInitialState() {
      return this.state;
    }
});
