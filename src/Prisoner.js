// Class that represents individual pieces.
let Piece =
  class {
    constructor(begin, end, disabled=false, reversed=false) {
      this.begin = begin;
      this.end = end;
      this.disabled = disabled;
      this.reversed = reversed;
      this.horizontal = this.begin.y === this.end.y;
      this.horizontalMovement = this.reversed ? !this.horizontal : this.horizontal;

      this.movement = {
        up: 0,
        down: 0,
        left: 0,
        right: 0
      };

      if ((this.begin.x > this.end.x || this.begin.y > this.end.y) ||
          (this.begin.x === this.end.x && this.begin.y === this.end.y)) {
        throw new Error("Piece coordinates aren't valid.");
      }
    }
  };

// Class that represents an entire state of a game.
let Game =
  class {
    constructor({width, height, prisoner}) {
      this.width = width;
      this.height = height;
      this.matrix = [];
      let iterable = __range__(0, this.width, false);
      for (let i = 0; i < iterable.length; i++) {
        let y = iterable[i];
        let row = [];
        let iterable1 = __range__(0, this.height, false);
        for (let j = 0; j < iterable1.length; j++) {
          let x = iterable1[j];
          row.push(0);
        }
        this.matrix.push(row);
      }

      this.pieces = [];
      this.addPiece(prisoner);
    }

    addPiece(piece) {
      this.pieces.push(piece);

      let designatedNum = this.pieces.length;

      return __range__(piece.begin.x, piece.end.x + 1, false).map((x) =>
        __range__(piece.begin.y, piece.end.y + 1, false).map((y) =>
          this.matrix[y][x] = designatedNum));
    }

    move(pieceIndex, direction, steps=1) {
      let piece = this.pieces[pieceIndex];
      let designatedNum = pieceIndex + 1;

      // Zero out
      let iterable4 = __range__(piece.begin.x, piece.end.x + 1, false);
      for (let i2 = 0; i2 < iterable4.length; i2++) {
        var x = iterable4[i2];
        let iterable5 = __range__(piece.begin.y, piece.end.y + 1, false);
        for (let j2 = 0; j2 < iterable5.length; j2++) {
          var y = iterable5[j2];
          this.matrix[y][x] = 0;
        }
      }

      let newBegin = {x: piece.begin.x, y: piece.begin.y};
      let newEnd   = {x: piece.end.x, y: piece.end.y};
      if (piece.horizontalMovement) {
        if (direction) {
          newBegin.x += steps;
          newEnd.x += steps;
        } else {
          newBegin.x -= steps;
          newEnd.x -= steps;
        }
      } else {
        if (direction) {
          newBegin.y += steps;
          newEnd.y += steps;
        } else {
          newBegin.y -= steps;
          newEnd.y -= steps;
        }
      }

      piece.begin = newBegin;
      piece.end = newEnd;

      let iterable6 = __range__(piece.begin.x, piece.end.x + 1, false);
      for (let k2 = 0; k2 < iterable6.length; k2++) {
        var x = iterable6[k2];
        let iterable7 = __range__(piece.begin.y, piece.end.y + 1, false);
        for (let i3 = 0; i3 < iterable7.length; i3++) {
          var y = iterable7[i3];
          this.matrix[y][x] = designatedNum;
        }
      }

      this.calculateAvailableMovement();

      return true;
    }

    calculateAvailableMovement() {
      for(var i=0;i<this.pieces.length;i++) {
        var piece = this.pieces[i];

        piece.movement.up = 0;
        piece.movement.down = 0;
        piece.movement.left = 0;
        piece.movement.right = 0;

        var steps = 1;
        while(true) {
          if (piece.end.x + steps >= this.width) { break; }

          if ((() => {
            for(var x=piece.end.x + 1; x<piece.end.x + steps + 1; x++) {
              for(var y=piece.begin.y; y<piece.end.y + 1; y++) {
                if(this.matrix[y][x] !== 0) return false;
              }
            }

            return true;
          })()) {
            piece.movement.right += 1;
          } else {
            break;
          }

          steps += 1;
        }

        var steps = 1;
        while(true) {
          if (piece.begin.x - steps < 0) { break; }

          if ((() => {
            for(var x=piece.begin.x - steps; x<piece.begin.x; x++) {
              for(var y=piece.begin.y; y<piece.end.y + 1; y++) {
                if(this.matrix[y][x] !== 0) return false;
              }
            }

            return true;
          })()) {
            piece.movement.left += 1;
          } else {
            break;
          }

          steps += 1;
        }

        var steps = 1;
        while(true) {
          if (piece.end.y + steps >= this.height) { break; }

          if ((() => {
            for(var x=piece.begin.x; x<piece.end.x + 1; x++) {
              for(var y=piece.end.y + 1; y<piece.end.y + steps + 1; y++) {
                if(this.matrix[y][x] !== 0) return false;
              }
            }

            return true;
          })()) {
            piece.movement.down += 1;
          } else {
            break;
          }

          steps += 1;
        }

        var steps = 1;
        while(true) {
          if (piece.begin.y - steps < 0) { break; }

          if ((() => {
            for(var x=piece.begin.x; x<piece.end.x + 1; x++) {
              for(var y=piece.begin.y - steps; y<piece.begin.y; y++) {
                if(this.matrix[y][x] !== 0) return false;
              }
            }

            return true;
          })()) {
            piece.movement.up += 1;
          } else {
            break;
          }

          steps += 1;
        }
      }
    }

    canExit() {
      let prisoner = this.pieces[0];

      if (prisoner.horizontal) {
        let iterable = __range__((prisoner.end.x + 1), this.width, false);
        for (let i = 0; i < iterable.length; i++) {
          let x = iterable[i];
          if (this.matrix[prisoner.end.y][x] !== 0) {
            return false;
          }
        }

      } else {
        let iterable1 = __range__((prisoner.end.y + 1), this.height, false);
        for (let j = 0; j < iterable1.length; j++) {
          let y = iterable1[j];
          if (this.matrix[y][prisoner.end.x] !== 0) {
            return false;
          }
        }
      }

      return true;
    }
  };

let arrayToGame = function(array, disabledPieces, reversedPieces) {
  let height = array.length;
  let width  = array[0].length;

  let arrayOfPoints = [];

  let iterable = __range__(0, height, false);
  for (let j = 0; j < iterable.length; j++) {
    let y = iterable[j];
    let iterable1 = __range__(0, width, false);
    for (let k = 0; k < iterable1.length; k++) {
      let x = iterable1[k];
      if (!arrayOfPoints[array[y][x]]) {
        arrayOfPoints[array[y][x]] = [];
      }

      arrayOfPoints[array[y][x]].push({x, y});
    }
  }

  let pieces = [];

  // We don't care about the 0s
  let iterable2 = __range__(1, arrayOfPoints.length, false);
  for (let i1 = 0; i1 < iterable2.length; i1++) {
    var i = iterable2[i1];
    let begin = arrayOfPoints[i][0];
    let end   = arrayOfPoints[i][arrayOfPoints[i].length - 1];

    pieces.push(new Piece(
      begin,
      end,
      disabledPieces.indexOf(pieces.length + 1) > -1,
      reversedPieces.indexOf(pieces.length + 1) > -1
    ));
  }

  let game = new Game({
    width,
    height,
    prisoner: pieces[0]});

  let iterable3 = __range__(1, pieces.length, false);
  for (let j1 = 0; j1 < iterable3.length; j1++) {
    var i = iterable3[j1];
    game.addPiece(pieces[i]);
  }

  game.calculateAvailableMovement();

  return game;
};

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
};

export { Game, Piece, arrayToGame};
