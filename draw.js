//function drawRect(ctx, coords, height, width, fillStyle, strokeStyle) {
function drawRect(ctx, x, y, width, height, fillStyle, strokeStyle) {
  var prevFillStyle = ctx.fillStyle;
  var prevStrokeStyle = ctx.strokeStyle;

  if (fillStyle) { ctx.fillStyle = fillStyle; }
  if (strokeStyle) { ctx.strokeStyle = strokeStyle; }

  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);

  if (fillStyle) { ctx.fillStyle = prevFillStyle; }
  if (strokeStyle) { ctx.strokeStyle = prevStrokeStyle; }
};

function darkenColor(color, percent) {
  return lightenColor(color, -1 * percent);
};

function lightenColor(color, percent) {
  if (color[0] !== "#") { color = "#" + color; }
  if (color.length === 4) { color = ['#', color[1], color[1], color[2], color[2], color[3], color[3]].join(''); }

  var num = parseInt(color.slice(1),16),
      amt = Math.round(255 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}
