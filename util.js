// includes both min and max
function randInt(min, max) {
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function relMouseCoords(event){
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do{
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  }
  while(currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function prettyCoords(coords) {
  return '[' + coords.x + ', ' + coords.y + ']';
}
