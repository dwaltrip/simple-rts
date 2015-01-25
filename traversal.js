var Traversal = function(params) {

  this.path = params.path;
  this.unit = params.unit;
  this.game = params.game;
  this.isNotFinished = true;

  var goalNode = this.path[this.path.length - 1];
  console.log('====== goalNode -- x:', goalNode.x, '-- y:', goalNode.y);
  var grid = this.game.graph.grid;
  var nextNodeIndex = 0;

  var logged = false;

  this.tick = function(tickAmount) {
    var distanceToMove = tickAmount * this.unit.velocity;
    var nextNode = this.path[nextNodeIndex];
    var nextNodeCoords = nodeCoords(nextNode);

    var distToNode = dist(nextNodeCoords, this.unit.getCoords());

    if (tickAmount) {

      var gn = this.path[this.path.length - 1];
      console.log('-- nextNodeCoords --', JSON.stringify(nextNodeCoords));
      console.log('-- this.unit -- gridX:', this.unit.gridX, '-- gridY:', this.unit.gridY, '-- x:', this.unit.x, '-- y:', this.unit.y);

      if (distToNode <= distanceToMove) {
        nextNodeIndex++;
        console.log('-- moveTo -- coords:', JSON.stringify(nextNodeCoords));
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
        console.log('-- moveTo -- vector:', JSON.stringify(vector));
        this.unit.move(vector);
      }

      console.log('====\n');
    }

    if (this.unit.gridX == goalNode.x && this.unit.gridY == goalNode.y) {
      this.isNotFinished = false;
    }
  }

  function nodeCoords(node) {
    var x = this.game.tileSize * node.x;
    var y = this.game.tileSize * node.y;
    return { x: x, y: y };
  }

  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2), Math.pow(p1.y - p2.y, 2));
  }
};
