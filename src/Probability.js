function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class {
  constructor({actions={change: 1, do: () => {}}, frequencyRange={min: 1000, max: 5000}, autostart=true}) {
      this.frequencyRange = frequencyRange;
      this.actions = actions;
      if(!this.actions.length) this.actions = [actions];

      this.timeout = null;

      this.start = this.start.bind(this);
      this.tick = this.tick.bind(this);

      if(autostart) {
        this.start();
      }
  }

  start() {
    this.timeout = setTimeout(this.tick, getRandomInt(this.frequencyRange.min, this.frequencyRange.max));
  }

  clear() {
    clearTimeout(this.timeout);
  }

  tick() {
    (() =>{
      for(var i=0;i<this.actions.length;i++) {
        var action = this.actions[i];

        var pick = getRandomInt(1, action.chance);
        if(pick===1) {
          return action.do();
        }
      }
    })();

    this.timeout = setTimeout(this.tick, getRandomInt(this.frequencyRange.min, this.frequencyRange.max));
  }
}
