var Unit = (function() {

  var unitCount = 0;
  var generateId = function() {
    unitCount++;
    return unitCount;
  };

  var VELOCITY = 0.05;

  return function(params) {
    var params = params || {};
    var self = this;

    this.name = 'Blob';
    this.id = generateId();
    this.x = params.x || null;
    this.y = params.y || null;
    this.game = params.game;
    updateGridCoords();

    this.width = params.width || null;
    this.height = params.height || null;
    this.color = params.color || '#2924FE';
    this.velocity = params.velocity || VELOCITY;

    this.move = function(params) {
      var dx = params.dx || 0;
      var dy = params.dy || 0;

      var newX = this.x + dx,
          newY = this.y + dy;

      this.x = newX;
      this.y = newY;

      updateGridCoords();
    }

    this.moveTo = function(coords) {
      this.x = coords.x;
      this.y = coords.y;
      updateGridCoords();
    }

    this.getCoords = function() {
      return { x: this.x, y: this.y };
    };

    this.getBoundingRect = function() {
      return { x: this.x, y: this.y, width: this.width, height: this.height };
    };

    this.toJSON = function() {
      return {
        name: this.name,
        id: this.id,
        coords: prettyCoords(this.getCoords())
      };
    };

    function updateGridCoords() {
      self.gridX = Math.floor(self.x / self.game.tileSize);
      self.gridY = Math.floor(self.y / self.game.tileSize);
    }
  };
})();
