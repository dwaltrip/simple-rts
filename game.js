var Game = function(params) {
  var self = this,
      ctx;
  var UNIT_SIZE = 10;

  function init(params) {
    params = params || {};
    this.canvas = params.canvas;
    this.context = this.canvas.getContext("2d");

    this.height = 500;
    this.width = 800;
    this.tileSize = 10;

    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    this.player1 = new Player({ game: this });
    this.units = [];

    ctx = this.context;
  };

  this.run = function() {
    gameLoop();
  };

  this.mouseDown = function(event) {
    var coords = this.canvas.relMouseCoords(event);

    console.log('-- mouseDown -- coords:', JSON.stringify(coords));

    var unit = new Unit({
      x: coords.x - (UNIT_SIZE / 2),
      y: coords.y - (UNIT_SIZE / 2),
      width: UNIT_SIZE,
      height: UNIT_SIZE,
      color: '#25F12A'
    });
    this.units.push(unit);
    window.setTimeout(function() {
      self.removeUnit(unit);
    }, 2000);
  };

  this.removeUnit = function(unitToRemove) {
    var removalIndex = null;
    for(var i=0; i < self.units.length; i++) {
      var unit = self.units[i];
      if (unit.id == unitToRemove.id) {
        removalIndex = i;
      }
    }
    this.units.splice(removalIndex, 1);
  }

  function gameLoop() {
    requestAnimationFrame(gameLoop);

    //Run all your game code here
    drawRect(ctx, 0, 0, self.width, self.height, "#ddd", "#555");

    for(var i=0; i < self.player1.units.length; i++) {
      var unit = self.player1.units[i];
      drawUnit(unit);
    }

    for(var i=0; i < self.units.length; i++) {
      var unit = self.units[i];
      drawUnit(unit);
    }
  }

  function isPointInRect(point, rect) {
    return (rect.x <= point.x  && point.x <= (rect.x + rect.width)) &&
           (rect.y <= point.y  && point.y <= (rect.y + rect.height));
  }

  function drawUnit(unit) {
    drawRect(ctx, unit.x, unit.y, unit.width, unit.height, unit.color, darkenColor(unit.color, 0.2));
  }

  init.call(this, params);
};
