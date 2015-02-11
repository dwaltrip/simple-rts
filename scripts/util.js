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
  return '[' + coords.x.toFixed(1) + ', ' + coords.y.toFixed(1) + ']';
}

function isPointInRect(point, rect) {
  return (rect.x <= point.x  && point.x <= (rect.x + rect.width)) &&
         (rect.y <= point.y  && point.y <= (rect.y + rect.height));
}

function doRectsOverlap(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x || rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y || rect2.y + rect2.height <= rect1.y
  );
}
