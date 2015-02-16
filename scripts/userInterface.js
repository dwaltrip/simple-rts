
var LEFT_MOUSE_BUTTON = 1,
    RIGHT_MOUSE_BUTTON = 3;

var UserInterface = function(params) {
  var game = params.game;
  var canvas = params.game.canvas;

  var self = this;
  this.mouse = { x: 0, y: 0, leftButton: 'up', rightButton: 'up', isDragging: false, lastButtonModified: null };

  // UI events
  // TODO: think about a less-coupled way to call commandManager.executeCommandsForEvent
  // TODO: I think there is still a bug or two here related to leaving and re-entering canvas (with different click states)
  var eventHandlers = {
    mousedown: function(event) {
      updateMouseButtons(event);
      game.commandManager.executeCommandsForEvent('mousedown');

      self.rawSelectionRect = { x: self.mouse.x, y: self.mouse.y, width: 0, height: 0 };
      self.selectionRect = { x: self.mouse.x, y: self.mouse.y, width: 0, height: 0 };
    },

    mousemove: function(event) {
      if (self.mouse.leftButton === 'down') {
        var coords = canvas.relMouseCoords(event);
        self.rawSelectionRect.width = coords.x - self.rawSelectionRect.x;
        self.rawSelectionRect.height = coords.y - self.rawSelectionRect.y;
        self.selectionRect = normalizeRect(self.rawSelectionRect);
        self.mouse.isDragging = true;
      }
    },

    mouseup: function(event) {
      // this is for edge case where you click down mouse outside of canvas and then drag into canvas
      if (!(self.mouse.leftButton === 'down' || self.mouse.rightButton === 'down')) { return; }

      updateMouseButtons(event);
      game.commandManager.executeCommandsForEvent('mouseup');

      self.rawSelectionRect = null;
      self.selectionRect = null;
      self.mouse.isDragging = false;
      self.mouse.lastButtonModified = null;
    },

    // TODO: remove duplication with mouseup
    mouseleave: function(event) {
      // TODO: event.which not reliable for mouseenter & leave on Firefox -- test if this fixes it
      if (self.mouse.leftButton === 'down') {
        event.which = LEFT_MOUSE_BUTTON;
        updateMouseButtons(event);

        game.commandManager.executeCommandsForEvent('mouseleave');

        self.rawSelectionRect = null;
        self.selectionRect = null;
        self.mouse.isDragging = false;
        self.mouse.lastButtonModified = null;
      }
    },

    mouseenter: function(event) {},

    // prevent browser right click menu
    contextmenu: function(event) { event.preventDefault(); return false; }
  };


  // TODO (maybe): bind handlers such that they don't need to use 'self'
  this.getEventHandlerFor = function(eventName) {
    return eventHandlers[eventName];
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
