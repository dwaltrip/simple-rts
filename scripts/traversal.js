var Traversal = function(params) {

  this.path = params.path;
  this.unit = params.unit;
  this.game = params.game;
  this.isFinished = false;

  var goalNode = this.path[this.path.length - 1];
  var goalCoords = nodeCoords(goalNode);
  var grid = this.game.graph.grid;
  var nextNodeIndex = 0;

  // TODO: refactor to be part of 'unitActions', when that is implemented!
  // should rename this to update..
  this.tick = function(tickAmount) {
    var distanceToMove = tickAmount * this.unit.velocity;
    var nextNode = this.path[nextNodeIndex];
    var nextNodeCoords = nodeCoords(nextNode);

    var distToNode = dist(nextNodeCoords, this.unit.getCoords());

    if (tickAmount) {
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

    if (this.unit.x == goalCoords.x && this.unit.y == goalCoords.y) {
      this.isFinished = true;
    }
  }

  function nodeCoords(node) {
    var x = this.game.tileSize * node.x;
    var y = this.game.tileSize * node.y;
    return { x: x, y: y };
  }

  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
};
