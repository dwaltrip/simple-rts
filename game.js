var Game = function(params) {
  var self = this,
      ctx;
  var UNIT_SIZE = 10;
  var timeDelta = 1,
      currTime, lastTime;
  var OPEN_TILE = 1;

  var DEBUG_MODE_OFF = true,
      DEBUG_SLOWDOWN_THRESHOLD = 200,
      debug_time_counter = 0;

  function init(params) {
    params = params || {};
    this.canvas = params.canvas;
    this.context = this.canvas.getContext("2d");

    this.height = 500;
    this.width = 800;
    this.tileSize = 10;

    this.gridWidth = this.width / this.tileSize;
    this.gridHeight = this.height / this.tileSize;
    var grid = [];
    for(var x=0; x<this.gridWidth; x++) {
      var row = [];
      for(var y=0; y<this.gridHeight; y++) { row.push(OPEN_TILE); }
      grid.push(row);
    }
    this.graph = new Graph(grid);

    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    this.player1 = new Player({ game: this });

    this.units = [];
    this.traversals = [];

    this.debugData = {};

    ctx = this.context;
  };

  this.run = function() {
    gameLoop();
  };

  this.mouseDown = function(event) {
    var coords = this.canvas.relMouseCoords(event);

    console.log('-- mouseDown -- coords:', JSON.stringify(coords));

    var unit = new Unit({
      game: this,
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

    currTime = new Date().getTime();
    timeDelta = lastTime ? (currTime - lastTime) : 0;
    lastTime = currTime;

    if (DEBUG_MODE_OFF || debug_time_counter > DEBUG_SLOWDOWN_THRESHOLD) {
      debug_time_counter = 0;

      drawRect(ctx, 0, 0, self.width, self.height, "#ddd", "#555");

      var inProgressTraversals = [];
      for(var i=0; i<self.traversals.length; i++) {
        var traversal = self.traversals[i];
        traversal.tick(timeDelta);
        if (traversal.isNotFinished) {
          inProgressTraversals.push(traversal);
        }
      }
      self.traversals = inProgressTraversals;

      for(var i=0; i < self.player1.units.length; i++) {
        var unit = self.player1.units[i];
        drawUnit(unit);
      }

      for(var i=0; i < self.units.length; i++) {
        var unit = self.units[i];
        drawUnit(unit);
      }

      self.drawDebugOverlay(self.debugData);
      
    } else {
      debug_time_counter += timeDelta;
    }
  }

  this.drawDebugOverlay = function(debugData) {
    var x0 = 10,
        y0 = 10;
    var fontSize = 12;

    drawRect(ctx, 10, 10, 150, 300, 'rgba(100, 100, 100, .8)', 'rgba(50, 50, 50, .8)');
    ctx.font = fontSize + 'px sans-serif';

    var yCoord = 25,
        yDelta = fontSize;
    for(var attr in debugData) {
      var val = debugData[attr];
      if (typeof val == 'object' && val !== null) {
        for (var nestedAttr in val) {
          ctx.fillText(nestedAttr + ': ' + JSON.stringify(val[nestedAttr]), 15, yCoord);
          yCoord += yDelta;
        }
      } else {
        ctx.fillText(attr + ': ' + JSON.stringify(debugData[attr]), 15, yCoord);
        yCoord += yDelta;
      }
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
