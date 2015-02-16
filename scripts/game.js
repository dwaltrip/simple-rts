var Game = function(params) {
  var self = this;
  var UNIT_SIZE = 10;
  var timeDelta = 1,
      currTime, lastTime;
  var OPEN_TILE = 1;


  var IS_DEBUG_SLOWDOWN_ON = true;
  //var IS_DEBUG_SLOWDOWN_ON = false;

  var DEBUG_SLOWDOWN_THRESHOLD = 0;
  // var DEBUG_SLOWDOWN_THRESHOLD = 50;
  var debug_time_counter = 0;

  //var IS_DEBUG_DISPLAY_ON = false;
  var IS_DEBUG_DISPLAY_ON = true;


  function init(params) {
    params = params || {};
    this.canvas = params.canvas;
    this.context = this.canvas.getContext("2d");

    this.mapHeight = 600;
    this.mapWidth = 800;
    this.borderWidth = 2;

    this.canvasHeight = this.mapHeight + 2 * this.borderWidth;
    this.canvasWidth = this.mapWidth + 2 * this.borderWidth;

    this.tileSize = 10;

    this.gridWidth = this.mapWidth / this.tileSize;
    this.gridHeight = this.mapHeight / this.tileSize;
    var grid = [];
    for(var x=0; x<this.gridWidth; x++) {
      var row = [];
      for(var y=0; y<this.gridHeight; y++) { row.push(OPEN_TILE); }
      grid.push(row);
    }
    this.graph = new Graph(grid);

    this.canvas.setAttribute("width", this.canvasWidth);
    this.canvas.setAttribute("height", this.canvasHeight);
    this.display = new Display({
      context: this.context,
      canvas: this.canvas,
      xOffset: this.borderWidth,
      yOffset: this.borderWidth
    });

    this.userInterface = new UserInterface({ game: this });
    this.commandManager = new CommandManager({ game: this });
    this.templateManager = new TemplateManager();

    this.player1 = new Player({ game: this, name: 'player1' });
    this.player2 = new Player({ game: this, name: 'player2', color: '#AA0E0E' });
    this.players = [this.player1, this.player2];
    this.currentPlayer = this.player1;

    this.player1.opponent = this.player2;
    this.player2.opponent = this.player1;
    this.opponent = this.player2;

    // this.units = []; // TODO: this array doesn't actually hold anything, yet is referenced
    this.traversals = {};
    this.selectedUnits = {};

    this.debugData = {};
  };

  this.run = function() {
    gameLoop();
  };

  this.instructSelectedUnitsToMoveTo = function(coord) {
    var goalNode = this.getGridNodeForCoord(coord);

    _.each(this.selectedUnits, function(unit) {
      var unitNode = this.getGridNodeForCoord(unit.getCoords());
      var path = astar.search(this.graph, unitNode, goalNode);

      if (path.length > 0) {
        this.traversals[unit.id] = new Traversal({ game: this, unit: unit, path: path });
      }
    }, this);
  };

  this.removeUnit = function(unitToRemove) {
    var removalIndex = null;
    for(var i=0; i < this.units.length; i++) {
      var unit = this.units[i];
      if (unit.id == unitToRemove.id) {
        removalIndex = i;
      }
    }
    this.units.splice(removalIndex, 1);
  };

  this.selectUnit = function(unit) {
    for(var unitId in this.selectedUnits) { delete this.selectedUnits[unitId]; }
    this.selectedUnits[unit.id] = unit;
  };

  this.selectUnitsAt = function(coord) {
    var newlySelectedUnits = _.filter(this.player1.units, function(unit) {
      return isPointInRect(coord, unit.getBoundingRect());
    }, this);

    if (newlySelectedUnits.length > 0) {
      for(var unitId in this.selectedUnits) { delete this.selectedUnits[unitId]; }
      this.selectUnits(newlySelectedUnits);
    }
  };

  this.selectUnitsInRect = function(rect) {
    var newlySelectedUnits = _.filter(this.player1.units, function(unit) {
      return doRectsOverlap(rect, unit.getBoundingRect());
    }, this);

    if (newlySelectedUnits.length > 0) {
      for(var unitId in this.selectedUnits) { delete this.selectedUnits[unitId]; }
      this.selectUnits(newlySelectedUnits);
    }
  };

  this.selectUnits = function(units) {
    _.each(units, function(unit) {
      this.selectedUnits[unit.id] = unit;
    }, this);
  };

  this.getGridNodeForCoord = function(coord) {
    var gridX = Math.floor(coord.x / this.tileSize),
        gridY = Math.floor(coord.y / this.tileSize);

    return this.graph.grid[gridX][gridY];
  };

  function gameLoop() {
    requestAnimationFrame(gameLoop);

    currTime = new Date().getTime();
    timeDelta = lastTime ? (currTime - lastTime) : 0;
    lastTime = currTime;

    if (IS_DEBUG_SLOWDOWN_ON || debug_time_counter > DEBUG_SLOWDOWN_THRESHOLD) {
      debug_time_counter = 0;

      drawRect(0, 0, self.canvasWidth, self.canvasHeight, "#ddd", "#555", true); 
      self.renderSidePanel();

      for(var unitId in self.traversals) {
        var traversal = self.traversals[unitId];
        traversal.tick(timeDelta);

        if (traversal.isFinished) {
          delete self.traversals[unitId];
        }
      }

      _.each(self.players, function(player) {
        _.each(player.units, function(unit) { drawUnit(unit); });
      });

      for(var unitId in self.selectedUnits) {
        var unit = self.selectedUnits[unitId];
        drawUnitSelection(unit);
      }

      var selectionRect = self.userInterface.selectionRect;
      if (selectionRect && selectionRect.width > 0 && selectionRect.height > 0) {
        drawRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height,
          'rgba(100, 250, 100, .1)', 'rgba(50, 200, 50, 1)');
      }

      if (IS_DEBUG_DISPLAY_ON && Object.keys(self.debugData).length > 0) {
        self.drawDebugOverlay(self.debugData);
      }
    } else {
      debug_time_counter += timeDelta;
    }
  }

  this.renderSidePanel = function() {
    if (this.previouslySelectedUnits == undefined) {
      this.previouslySelectedUnits = Object.keys(this.selectedUnits);
      this.previouslySelectedUnits.sort();
      this.previouslySelectedUnits = this.previouslySelectedUnits.join('-');
    }

    var currentUnits = Object.keys(this.selectedUnits);
    currentUnits.sort();
    var currentUnits = currentUnits.join('-');

    if (currentUnits !== this.previouslySelectedUnits) {
      var detailsList = $('.unit-details-list');

      detailsList.empty();
      this.templateManager.removeObserversForTemplate('unitDetails'); // NEED TO CLEAN UP OBSERVERS HERE ALSO

      _.each(this.selectedUnits, function(selectedUnit) {
        this.templateManager.render('unitDetails', detailsList, selectedUnit);
      }, this);

      this.previouslySelectedUnits = currentUnits;
    }
  }

  this.drawDebugOverlay = function(debugData) {
    var x0 = 10,
        y0 = 10;
    var fontSize = 12;

    drawRect(10, 10, 150, 300, 'rgba(100, 100, 100, .8)', 'rgba(50, 50, 50, .8)');
    this.context.font = fontSize + 'px sans-serif';

    var yCoord = 25,
        yDelta = fontSize;
    for(var attr in debugData) {
      var val = debugData[attr];
      if (typeof val == 'object' && val !== null) {
        for (var nestedAttr in val) {
          this.context.fillText(nestedAttr + ': ' + JSON.stringify(val[nestedAttr]), 15, yCoord);
          yCoord += yDelta;
        }
      } else {
        this.context.fillText(attr + ': ' + JSON.stringify(debugData[attr]), 15, yCoord);
        yCoord += yDelta;
      }
    }
  }

  function drawUnit(unit) {
    drawRect(unit.x, unit.y, unit.width, unit.height, unit.color, darkenColor(unit.color, 0.2));
  }

  function drawUnitSelection(unit) {
    var selectorSize = 4;
    var xOffset = Math.floor((unit.width - selectorSize) / 2);
    var yOffset = Math.floor((unit.height - selectorSize) / 2);

    var selectorColor = '#25F12A';
    drawRect(unit.x + xOffset, unit.y + yOffset, selectorSize, selectorSize, selectorColor, darkenColor(selectorColor, 0.1));
  }

  function drawRect() {
    self.display.drawRect.apply(self.display, arguments);
  }

  init.call(this, params);
};
