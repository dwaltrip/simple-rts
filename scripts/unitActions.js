
var Action = {
  MOVE: 0,
  ATTACK: 1
}

var Attack = (function() {
  var CHASING = 0,
      ATTACKING = 1;


  return function(params) {
    var self = this;

    this.attacker = params.attacker;
    this.target = params.target;
    this.game = params.game;
    this.isFinished = false;

    this.type = Action.ATTACK;

    this.state = null;
    this.traversal = null;
    determineSubState();

    this.update = function(timeDelta) {

      if (this.target.hitpoints <= 0) {
        this.isFinished = true;

      } else if (this.state === CHASING) {
        // todo: make this section more advanced
        // var targetHasMoved = !areCoordsEqual(this.target.getCoords(), this.traversal.goalCoords);
        // if (targetHasMoved) {}

        this.traversal.update(timeDelta);

        if (this.traversal.isFinished) {
          this.traversal = null;
          this.state = ATTACKING;
        }
      } else if (this.state === ATTACKING) {
        var workInProgress = true
      }

      this.game.debugData['unit-action-' + this.attacker.id] = {
        action: 'ATTACK',
        attackerId: this.attacker.id,
        targetHitpoints: this.target.hitpoints,
        attackState: this.state
      };
    };

    function determineSubState() {

      var distance = distanceBetweenCoords(self.attacker.getCoords(), self.target.getCoords());

      if (self.attacker.attack.range < distance) {
        self.state = CHASING;

        var targetNode = self.game.getGridNodeForCoord(self.target.getCoords());
        var attackerNode = self.game.getGridNodeForCoord(self.attacker.getCoords());
        var path = astar.search(self.game.graph, attackerNode, targetNode);

        var getDistanceBetweenStoppingPointAndTarget = function(path) {
          if (path.length < 0) {
            return distanceBetweenCoords(self.attacker.getCoords(), self.target.getCoords());
          } else {
            return distanceBetweenCoords(nodeCoords(path[path.length - 1]), self.target.getCoords());
          }
        };

        var counter = 0;
        while (getDistanceBetweenStoppingPointAndTarget(path) < self.attacker.attack.range) {
          path.pop();
        }

        self.traversal = new Traversal({ game: self.game, unit: self.attacker, path: path });
      } else {
        self.state = ATTACKING;

      }
    }
  };
})();
