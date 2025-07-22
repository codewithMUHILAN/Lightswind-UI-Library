class Panel {
  constructor(name, fg, bg) {
    this.name = name;
    this.fg = fg;
    this.bg = bg;
    this.gradient = null;
    this.PR = Math.round(window.devicePixelRatio || 1);
    this.WIDTH = 90 * this.PR;
    this.HEIGHT = 48 * this.PR;
    this.TEXT_X = 3 * this.PR;
    this.TEXT_Y = 2 * this.PR;
    this.GRAPH_X = 3 * this.PR;
    this.GRAPH_Y = 15 * this.PR;
    this.GRAPH_WIDTH = 84 * this.PR;
    this.GRAPH_HEIGHT = 30 * this.PR;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.canvas.style.width = "90px";
    this.canvas.style.height = "48px";
    this.canvas.style.position = "absolute";
    this.canvas.style.cssText = "width:90px;height:48px";
    this.context = this.canvas.getContext("2d");
    this.initializeCanvas();
  }
  createGradient() {
    if (!this.context)
      throw new Error("No context");
    const gradient = this.context.createLinearGradient(
      0,
      this.GRAPH_Y,
      0,
      this.GRAPH_Y + this.GRAPH_HEIGHT
    );
    let startColor;
    const endColor = this.fg;
    switch (this.fg.toLowerCase()) {
      case "#0ff":
        startColor = "#006666";
        break;
      case "#0f0":
        startColor = "#006600";
        break;
      case "#ff0":
        startColor = "#666600";
        break;
      case "#e1e1e1":
        startColor = "#666666";
        break;
      default:
        startColor = this.bg;
        break;
    }
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  }
  initializeCanvas() {
    if (!this.context)
      return;
    this.context.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif";
    this.context.textBaseline = "top";
    this.gradient = this.createGradient();
    this.context.fillStyle = this.bg;
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.context.fillStyle = this.fg;
    this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y);
    this.context.fillStyle = this.fg;
    this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
    this.context.fillStyle = this.bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
  }
  update(value, valueGraph, maxValue, maxGraph, decimals = 0) {
    if (!this.context || !this.gradient)
      return;
    const min = Math.min(Infinity, value);
    const max = Math.max(maxValue, value);
    maxGraph = Math.max(maxGraph, valueGraph);
    this.context.globalAlpha = 1;
    this.context.fillStyle = this.bg;
    this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
    this.context.fillStyle = this.fg;
    this.context.fillText(
      `${value.toFixed(decimals)} ${this.name} (${min.toFixed(decimals)}-${parseFloat(
        max.toFixed(decimals)
      )})`,
      this.TEXT_X,
      this.TEXT_Y
    );
    this.context.drawImage(
      this.canvas,
      this.GRAPH_X + this.PR,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
      this.GRAPH_X,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT
    );
    const columnHeight = this.GRAPH_HEIGHT - (1 - valueGraph / maxGraph) * this.GRAPH_HEIGHT;
    if (columnHeight > 0) {
      this.context.globalAlpha = 1;
      this.context.fillStyle = this.gradient;
      this.context.fillRect(
        this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
        this.GRAPH_Y + this.GRAPH_HEIGHT - columnHeight,
        this.PR,
        columnHeight
      );
    }
  }
}
export {
  Panel
};
//# sourceMappingURL=panel.js.map
