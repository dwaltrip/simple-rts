var Traversal = function(params) {

  this.path = params.path;
  this.unit = params.unit;
  this.game = params.game;
  this.isFinished = false;
  this.type = Action.MOVE;

  var goalNode = this.path[this.path.length - 1];
  this.goalCoords = nodeCoords(goalNode);
  var grid = this.game.graph.grid;
  var nextNodeIndex = 0;

  // TODO: refactor to be part of 'unitActions', when that is implemented!
  this.update = function(timeDelta) {
    var distanceToMove = timeDelta * this.unit.velocity;
    var nextNode = this.path[nextNodeIndex];
    var nextNodeCoords = nodeCoords(nextNode);

    var distToNode = distanceBetweenCoords(nextNodeCoords, this.unit.getCoords());

    if (timeDelta) {
      if (distToNode <= distanceToMove) {
        nextNodeIndex++;
        this.unit.moveTo(nextNodeCoords);
      } 
      else {
        var dx = (nextNodeCoords.x - this.unit.x);
        var dy = (nextNodeCoords.y - this.unit.y);

        if (dx > 0) { dx = 1; } else if (dx < 0) { dx = -1; }
        if (dy > 0) { dy = 1; } else if (dy < 0) { dy = -1; }

        dx = dx * distanceToMove;
        dy = dy * distanceToMove;

        var vector = { dx: dx, dy: dy };
        this.unit.move(vector);
      }
    }

    if (this.unit.currentAction.type === Action.MOVE) {
      this.game.debugData['unit-action-' + this.unit.id] = {
        action: 'MOVE',
        pathLength: this.path.length,
        nextNodeIndex: nextNodeIndex
      };
    }

    if (areCoordsEqual(this.unit.getCoords(), this.goalCoords)) {
      this.isFinished = true;
    }
  }
};
