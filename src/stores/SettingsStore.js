import Reflux from 'reflux';
import { AsyncStorage } from 'react-native';
import Sound from 'react-native-sound';

import { SettingsActions, GameActions } from '../Actions';


// Preload sounds
const SOUNDS = {
  music: new Sound('track1.mp3', Sound.MAIN_BUNDLE),
  pieceMovement: new Sound('move2.mp3', Sound.MAIN_BUNDLE),
  click: new Sound('click1.mp3', Sound.MAIN_BUNDLE)
};
const DEFAULT_STATE = {
  music: true,
  sound: true,
  faces: true,
  difficulty: 0
};

export default Reflux.createStore({
    listenables: SettingsActions,

    init() {
      this.loaded = AsyncStorage.getItem('SettingsStore:state');
      this.loaded.then((storedState) => {
        if (storedState === null) {
          AsyncStorage.setItem('SettingsStore:state', JSON.stringify(DEFAULT_STATE));
        } else {
          storedState = JSON.parse(storedState);
        }
        this.state = Object.assign({}, DEFAULT_STATE, storedState);
        this.trigger(this.state);

        setTimeout(() => {
          SettingsActions.playMusic();
        }, 1000)

        GameActions.setDifficulty(this.state.difficulty)
      });

      this.state = Object.assign({}, DEFAULT_STATE);
    },

    getInitialState() {
      return this.state;
    },

    set(key, value) {
      this.state[key] = value;

      AsyncStorage.setItem('SettingsStore:state', JSON.stringify(this.state));
      this.trigger(this.state);
    },

    toggle(key) {
      this.state[key] = !this.state[key];

      if(key === 'music') {
        if(this.state[key]) {
          SettingsActions.playMusic();
        } else {
          SettingsActions.stopMusic();
        }
      }

      AsyncStorage.setItem('SettingsStore:state', JSON.stringify(this.state));
      this.trigger(this.state);
    },

    stopMusic() {
      SOUNDS.music.pause();
    },

    playMusic() {
      if(this.state.music) {
        SOUNDS.music.play();
        SOUNDS.music.setNumberOfLoops(-1);
      }
    },

    playSound(sound) {
      if(this.state.sound) {
        SOUNDS[sound].stop();
        SOUNDS[sound].play();
      }
    }
});
