var Player = (function() {

  return function(params) {
    var self = this;

    this.game = params.game;
    this.units = [ buildUnit(), buildUnit(), buildUnit(), buildUnit(), buildUnit() ];

    function buildUnit() {
      var UNIT_SIZE = 10;

      return new Unit({
        x: randInt(0, self.game.width - UNIT_SIZE),
        y: randInt(0, self.game.height - UNIT_SIZE),
        width: UNIT_SIZE,
        height: UNIT_SIZE
      });
    }
  };
})();
