
function getUnit(unitId) {
  return _.find(game.player1.units, function(unit) {
    return unit.id === unitId;
  });
}
