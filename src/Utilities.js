import color from 'color';
import Palette from 'google-material-color/dist/palette';

const shuffle = function(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

const IntervalTimer = function(callback, interval) {
  var timerId, startTime, remaining = 0;
  var state = 0; // 0 = idle, 1 = running, 2 = paused, 3= resumed

  this.destroy = function () {
    clearInterval(timerId);
  };

  this.pause = function () {
    if (state != 1) return;

    remaining = interval - (new Date() - startTime);
    clearInterval(timerId);
    state = 2;
  };

  this.resume = function () {
    if (state != 2) return;

    state = 3;
    setTimeout(this.timeoutCallback, remaining);
  };

  this.timeoutCallback = function () {
    if (state != 3) return;

    callback();

    startTime = new Date();
    timerId = setInterval(callback, interval);
    state = 1;
  };

  startTime = new Date();
  timerId = setInterval(callback, interval);
  state = 1;
};

var calculateStars = function(difficulty, level, totalTime) {
  var starTimes = calculateStarTimes(difficulty, level);

  if(totalTime <= starTimes[3]) return 3;
  else if(totalTime <= starTimes[3] + starTimes[2]) return 2;
  else return 1;
};

var calculateStarTimes = function(difficulty, level) {
  var time = (15 * (difficulty + 1)) + (0.5 * (level + 1)) >> 0

  return {
    3: time,
    2: time
  };
};

var DIFFICULTY_COLORS = [
  {
    700: Palette.get('Green', '700'),
    500: Palette.get('Green', '500'),
    400: Palette.get('Green', '400')
  },
  {
    700: Palette.get('Indigo', '700'),
    500: Palette.get('Indigo', '500'),
    400: Palette.get('Indigo', '400')
  },
  {
    700: Palette.get('Red', '700'),
    500: Palette.get('Red', '500'),
    400: Palette.get('Red', '400')
  }
]

export { shuffle, IntervalTimer, calculateStars, calculateStarTimes, DIFFICULTY_COLORS };
