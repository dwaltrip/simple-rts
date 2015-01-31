var Player = (function() {

  return function(params) {
    var self = this;

    this.game = params.game;
    this.units = [ buildUnit(), buildUnit(), buildUnit(), buildUnit(), buildUnit() ];

    function buildUnit() {
      var UNIT_SIZE = 10;

      return new Unit({
        game: self.game,
        x: Math.floor(randInt(0, self.game.mapWidth - UNIT_SIZE) / self.game.tileSize) * self.game.tileSize,
        y: Math.floor(randInt(0, self.game.mapHeight - UNIT_SIZE) / self.game.tileSize) * self.game.tileSize,
        width: UNIT_SIZE,
        height: UNIT_SIZE
      });
    }
  };
})();
