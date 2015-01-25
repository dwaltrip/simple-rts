var Game = function(params) {
  var self = this;

  function init(params) {
    params = params || {};
    this.canvas = params.canvas;
    this.context = this.canvas.getContext("2d");

    this.height = 600;
    this.width = 800;

    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    var ctx = this.context;
    drawRect(ctx, 0, 0, this.width, this.height, "#ddd", "#555");
  };

  init.call(this, params);
};
