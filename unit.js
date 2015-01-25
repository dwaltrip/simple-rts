var Unit = (function() {

  var unitCount = 0;
  var generateId = function() {
    unitCount++;
    return unitCount;
  };

  return function(params) {
    var params = params || {};

    this.id = generateId();
    this.x = params.x || null;
    this.y = params.y || null;
    this.width = params.width || null;
    this.height = params.height || null;
    this.color = params.color || '#2924FE';
  };
})();
