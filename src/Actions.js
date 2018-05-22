import Reflux from 'reflux';


const GameActions = Reflux.createActions([
  'set',
  'setDifficulty',
  'previousLevel',
  'nextLevel',
  'move',
  'reset',
  'won'
]);

const MainMenuActions = Reflux.createActions([
  'show',
  'hide'
]);

const SettingsActions = Reflux.createActions([
  'set',
  'toggle',
  'playMusic',
  'stopMusic',
  'playSound',
  'setDifficulty'
]);

const TimerActions = Reflux.createActions([
  'set',
  'tick',
  'pause',
  'resume',
  'destroy'
]);

const BadgeActions = Reflux.createActions([
  'set',
  'setObtainedStars',
  'startGame',
  'endGame',
  'dropStar'
]);

const WonBadgeActions = Reflux.createActions([
  'show'
]);

export { GameActions, MainMenuActions, SettingsActions, TimerActions, BadgeActions, WonBadgeActions };
