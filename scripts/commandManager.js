
var CommandManager = function(params) {

  // -------------------------------------------
  // DEFINITIONS FOR WHEN COMMANDS ARE PERFORMED
  // -------------------------------------------

  var conditions = [
    {
      eventName: 'mouseup', mouse: { targetButton: 'left', isDragging: false },
      commandName: 'selectSingleUnit'
    }, {
      eventName: 'mouseup', mouse: { targetButton: 'left', isDragging: true },
      commandName: 'selectMultipleUnits'
    }, {
      eventName: 'mouseleave', mouse: { targetButton: 'left', isDragging: true },
      commandName: 'selectMultipleUnits'
    }, {
      eventName: 'mouseup', mouse: { targetButton: 'right', isDragging: false },
      commandName: 'performPrimaryAction'
    }
  ];

  var self = this;
  this.game = params.game;
  compileCommands();

  // ----------------------------
  // LOGIC FOR EXECUTING COMMANDS
  // ----------------------------

  var commandList = {
    selectSingleUnit: function() {
      self.game.selectUnitAt(self.game.userInterface.mouse);
    },

    selectMultipleUnits: function() {
      self.game.selectUnitsInRect(self.game.userInterface.selectionRect);
    },

    performPrimaryAction: function() {
      var mouseCoords = self.game.userInterface.mouse;

      var targetOfAttack = _.find(self.game.currentPlayer.opponent.units, function(unit) {
        return isPointInRect(mouseCoords, unit.getBoundingRect());
      });

      // we can get away with only checking first selected units,
      // as you cant select you own units and an enemy unit at the same time
      var hasSelectedUnits = Object.keys(self.game.selectedUnits).length > 0 &&
        self.game.selectedUnits[Object.keys(self.game.selectedUnits)[0]].player === self.game.currentPlayer;

      if (targetOfAttack && hasSelectedUnits) {
        console.log('-- attacking!')
        // TODO: do something with this new Attack object
        var attack = new Attack({
          attackers: _.map(this.selectedUnits, function(unit) { return unit; }),
          target: targetOfAttack
        });
      } else if(hasSelectedUnits) {
        self.game.instructSelectedUnitsToMoveTo(mouseCoords);
      }
    }
  };

  // -------------------------
  // ADMINISTRATEIVE FUNCTIONS
  // -------------------------

  this.executeCommandsForEvent = function(eventName) {
    var command = _.find(this.commands, function(command) {
      return command.shouldPerform(eventName, self.game.userInterface, self.game);
    });

    if (command) {
      commandList[command.name]();
    }
  };
  
  function compileCommands() {
    self.commands = [];

    _.each(conditions, function(condition) {
      if (!condition.mouse) { condition.mouse = {}; }

      var shouldPerform = function(eventName, userInterface, game) {
        var eventNameMatches = eventName === condition.eventName,
            mouseStateMatches = true;

        if (condition.mouse.targetButton && userInterface.mouse.lastButtonModified !== condition.mouse.targetButton) {
          mouseStateMatches = false;
        }
        if (condition.mouse.hasOwnProperty('isDragging') && condition.mouse.isDragging !== userInterface.mouse.isDragging) {
          mouseStateMatches = false;
        }

        return eventNameMatches && mouseStateMatches;
      };

      self.commands.push({
        shouldPerform: shouldPerform,
        name: condition.commandName
      });
    });
  }
};
