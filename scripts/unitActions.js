
var Attack = function(params) {
  var self = this;

  this.attackers = params.attackers;
  this.target = params.target;

  this.update = function() {
    // manage the state of the attack, such as PURSUIING, ATTACKING, FINISHED
    // perform updates to units depending on state (reduce HP, move units toward target, etc)
    console.log('-- update');
  }
};
