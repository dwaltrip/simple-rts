var Player = (function() {

  return function(params) {
    var self = this;

    this.game = params.game;
    this.color = params.color || '#2924FE';
    this.units = [ buildUnit(), buildUnit(), buildUnit(), buildUnit(), buildUnit() ];
    this.name = params.name;

    this.getUnitsAtCoord = function(coord) {
      return _.filter(this.units, function(unit) {
        return isPointInRect(coord, unit.getBoundingRect());
      }, this);
    };

    function buildUnit() {
      var UNIT_SIZE = 10;

      return new Unit({
        game: self.game,
        x: Math.floor(randInt(0, self.game.mapWidth - UNIT_SIZE) / self.game.tileSize) * self.game.tileSize,
        y: Math.floor(randInt(0, self.game.mapHeight - UNIT_SIZE) / self.game.tileSize) * self.game.tileSize,
        hitpoints: 50,
        attack: {
          damage: 10,
          range: 10,
          cooldown: 2000
        },
        width: UNIT_SIZE,
        height: UNIT_SIZE,
        player: self,
        color: self.color
      });
    }
  };
})();
