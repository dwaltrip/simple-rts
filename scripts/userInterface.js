
var LEFT_MOUSE_BUTTON = 1,
    RIGHT_MOUSE_BUTTON = 3;

var UserInterface = function(params) {
  var game = params.game;
  var canvas = params.game.canvas;

  // TODO: using self inside public methods that handle DOM events as 'addEventListener' binds callbacks to DOM element
  var self = this;
  this.mouse = { x: 0, y: 0, leftButton: 'up', rightButton: 'up', isDragging: false, lastButtonModified: null };

  this.onMouseDown = function(event) {
    updateMouseButtons(event);
    game.commandManager.executeCommandsForEvent('mousedown');

    self.rawSelectionRect = { x: self.mouse.x, y: self.mouse.y, width: 0, height: 0 };
    self.selectionRect = { x: self.mouse.x, y: self.mouse.y, width: 0, height: 0 };
  };

  this.onMouseMove = function(event) {
    if (self.mouse.leftButton === 'down') {
      var coords = canvas.relMouseCoords(event);
      self.rawSelectionRect.width = coords.x - self.rawSelectionRect.x;
      self.rawSelectionRect.height = coords.y - self.rawSelectionRect.y;
      self.selectionRect = normalizeRect(self.rawSelectionRect);
      self.mouse.isDragging = true;
    }
  };

  self.onMouseUp = function(event) {
    updateMouseButtons(event);
    game.commandManager.executeCommandsForEvent('mouseup');

    self.rawSelectionRect = null;
    self.selectionRect = null;
    self.mouse.isDragging = false;
  };

  function updateMouseButtons(event) {
    if (event.which === LEFT_MOUSE_BUTTON) {
      self.mouse.leftButton = self.mouse.leftButton === 'up' ? 'down' : 'up';
      self.mouse.lastButtonModified = 'left';
    } else if (event.which === RIGHT_MOUSE_BUTTON) {
      self.mouse.rightButton = self.mouse.rightButton === 'up' ? 'down' : 'up';
      self.mouse.lastButtonModified = 'right';
    }

    var coords = canvas.relMouseCoords(event);
    self.mouse.x = coords.x;
    self.mouse.y = coords.y;
  }

  // right click
  this.onContextMenu = function(event) {
    event.preventDefault();
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


// function setupKeyboardListeners() {
//   document.onkeydown = function(e) {
//     var arrowKey = getArrowKey(e);
//     if (arrowKey) {
//       self.pressedArrowKeys[arrowKey] = true;
//       return false; // Prevent event from bubbling up (arrow keys will scroll the page)
//     }
//   }

//   document.onkeyup = function(e) {
//     var arrowKey = getArrowKey(e);
//     if (arrowKey) {
//       self.pressedArrowKeys[arrowKey] = false;
//       return false; // Prevent event from bubbling up (arrow keys will scroll the page)
//     }
//   }
// }

// function getArrowKey(e) {
//   e = e || window.event;

//   switch(e.keyCode) {
//     case 37: return 'left';
//     case 38: return 'up';
//     case 39: return 'right';
//     case 40: return 'down';
//   }
// }
