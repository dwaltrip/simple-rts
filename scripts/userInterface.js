var UserInterface = function(params) {

  var game = params.game;
  var canvas = params.game.canvas;
  var isDragging = false;
  var self = this;

  this.onMouseDown = function(event) {
    var mouseCoords = canvas.relMouseCoords(event);
    game.selectUnitsAt(mouseCoords);

    self.rawSelectionRect = { x: mouseCoords.x, y: mouseCoords.y, width: 0, height: 0 };
    self.selectionRect =    { x: mouseCoords.x, y: mouseCoords.y, width: 0, height: 0 };

    isDragging = true;
  };

  this.onMouseMove = function(event) {
    if (isDragging) {
      var mouseCoords = canvas.relMouseCoords(event);
      self.rawSelectionRect.width = mouseCoords.x - self.rawSelectionRect.x;
      self.rawSelectionRect.height = mouseCoords.y - self.rawSelectionRect.y;
      self.selectionRect = normalizeRect(self.rawSelectionRect);
    }
  };

  this.onMouseUp = function(event) {
    isDragging = false;
    game.selectUnitsInRect(self.selectionRect);

    self.rawSelectionRect = null;
    self.selectionRect =    null;
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // TODO: fix bug where right clicking selects a unit
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // right click
  // TODO: CREATE STATE MACHINE
  this.onContextMenu = function(event) {
    event.preventDefault();

    var mouseCoords = canvas.relMouseCoords(event);
    var targetOfAttack = _.find(game.currentPlayer.opponent.units, function(unit) {
      return isPointInRect(mouseCoords, unit.getBoundingRect());
    });
    var hasSelectedUnits = Object.keys(game.selectedUnits).length > 0;

    if (targetOfAttack && hasSelectedUnits) {
      // TODO: do something with this new Attack object
      var attack = new Attack({
        attackers: _.map(this.selectedUnits, function(unit) { return unit; }),
        target: targetOfAttack
      });

    } else {
      game.instructSelectedUnitsToMoveTo(mouseCoords);
    }

    return false;
  };

  // flips negative width and height values
  function normalizeRect(rect) {
    var normalizedRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };

    if (rect.width < 0) {
      normalizedRect.x = rect.x + rect.width;
      normalizedRect.width = -1 * rect.width;
    }

    if (rect.height < 0) {
      normalizedRect.y = rect.y + rect.height;
      normalizedRect.height = -1 * rect.height;
    }

    return normalizedRect;
  }
};
