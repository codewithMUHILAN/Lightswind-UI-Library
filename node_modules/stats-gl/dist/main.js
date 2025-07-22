import { Panel } from "./panel.js";
const _Stats = class _Stats2 {
  constructor({
    trackGPU = false,
    logsPerSecond = 30,
    samplesLog = 60,
    samplesGraph = 10,
    precision = 2,
    minimal = false,
    horizontal = true,
    mode = 0
  } = {}) {
    this.gl = null;
    this.ext = null;
    this.activeQuery = null;
    this.gpuQueries = [];
    this.threeRendererPatched = false;
    this.frames = 0;
    this.renderCount = 0;
    this.isRunningCPUProfiling = false;
    this.totalCpuDuration = 0;
    this.totalGpuDuration = 0;
    this.totalGpuDurationCompute = 0;
    this.totalFps = 0;
    this.gpuPanel = null;
    this.gpuPanelCompute = null;
    this.averageFps = { logs: [], graph: [] };
    this.averageCpu = { logs: [], graph: [] };
    this.averageGpu = { logs: [], graph: [] };
    this.averageGpuCompute = { logs: [], graph: [] };
    this.handleClick = (event) => {
      event.preventDefault();
      this.showPanel(++this.mode % this.dom.children.length);
    };
    this.handleResize = () => {
      this.resizePanel(this.fpsPanel, 0);
      this.resizePanel(this.msPanel, 1);
      if (this.gpuPanel)
        this.resizePanel(this.gpuPanel, 2);
      if (this.gpuPanelCompute)
        this.resizePanel(this.gpuPanelCompute, 3);
    };
    this.mode = mode;
    this.horizontal = horizontal;
    this.minimal = minimal;
    this.trackGPU = trackGPU;
    this.samplesLog = samplesLog;
    this.samplesGraph = samplesGraph;
    this.precision = precision;
    this.logsPerSecond = logsPerSecond;
    this.dom = document.createElement("div");
    this.initializeDOM();
    this.beginTime = performance.now();
    this.prevTime = this.beginTime;
    this.prevCpuTime = this.beginTime;
    this.fpsPanel = this.addPanel(new _Stats2.Panel("FPS", "#0ff", "#002"), 0);
    this.msPanel = this.addPanel(new _Stats2.Panel("CPU", "#0f0", "#020"), 1);
    this.setupEventListeners();
  }
  initializeDOM() {
    this.dom.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      opacity: 0.9;
      z-index: 10000;
      ${this.minimal ? "cursor: pointer;" : ""}
    `;
  }
  setupEventListeners() {
    if (this.minimal) {
      this.dom.addEventListener("click", this.handleClick);
      this.showPanel(this.mode);
    } else {
      window.addEventListener("resize", this.handleResize);
    }
  }
  async init(canvasOrGL) {
    if (!canvasOrGL) {
      console.error('Stats: The "canvas" parameter is undefined.');
      return;
    }
    if (this.handleThreeRenderer(canvasOrGL))
      return;
    if (await this.handleWebGPURenderer(canvasOrGL))
      return;
    if (!this.initializeWebGL(canvasOrGL))
      return;
  }
  handleThreeRenderer(renderer) {
    if (renderer.isWebGLRenderer && !this.threeRendererPatched) {
      this.patchThreeRenderer(renderer);
      this.gl = renderer.getContext();
      if (this.trackGPU) {
        this.initializeGPUTracking();
      }
      return true;
    }
    return false;
  }
  async handleWebGPURenderer(renderer) {
    if (renderer.isWebGPURenderer) {
      if (this.trackGPU) {
        renderer.backend.trackTimestamp = true;
        if (await renderer.hasFeatureAsync("timestamp-query")) {
          this.initializeWebGPUPanels();
        }
      }
      this.info = renderer.info;
      return true;
    }
    return false;
  }
  initializeWebGPUPanels() {
    this.gpuPanel = this.addPanel(new _Stats2.Panel("GPU", "#ff0", "#220"), 2);
    this.gpuPanelCompute = this.addPanel(
      new _Stats2.Panel("CPT", "#e1e1e1", "#212121"),
      3
    );
  }
  initializeWebGL(canvasOrGL) {
    if (canvasOrGL instanceof WebGL2RenderingContext) {
      this.gl = canvasOrGL;
    } else if (canvasOrGL instanceof HTMLCanvasElement || canvasOrGL instanceof OffscreenCanvas) {
      this.gl = canvasOrGL.getContext("webgl2");
      if (!this.gl) {
        console.error("Stats: Unable to obtain WebGL2 context.");
        return false;
      }
    } else {
      console.error(
        "Stats: Invalid input type. Expected WebGL2RenderingContext, HTMLCanvasElement, or OffscreenCanvas."
      );
      return false;
    }
    return true;
  }
  initializeGPUTracking() {
    if (this.gl) {
      this.ext = this.gl.getExtension("EXT_disjoint_timer_query_webgl2");
      if (this.ext) {
        this.gpuPanel = this.addPanel(new _Stats2.Panel("GPU", "#ff0", "#220"), 2);
      }
    }
  }
  begin() {
    if (!this.isRunningCPUProfiling) {
      this.beginProfiling("cpu-started");
    }
    if (!this.gl || !this.ext)
      return;
    if (this.activeQuery) {
      this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);
    }
    this.activeQuery = this.gl.createQuery();
    if (this.activeQuery) {
      this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, this.activeQuery);
    }
  }
  end() {
    this.renderCount++;
    if (this.gl && this.ext && this.activeQuery) {
      this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);
      this.gpuQueries.push({ query: this.activeQuery });
      this.activeQuery = null;
    }
  }
  update() {
    if (!this.info) {
      this.processGpuQueries();
    } else {
      this.processWebGPUTimestamps();
    }
    this.endProfiling("cpu-started", "cpu-finished", "cpu-duration");
    this.updateAverages();
    this.resetCounters();
  }
  processWebGPUTimestamps() {
    this.totalGpuDuration = this.info.render.timestamp;
    this.totalGpuDurationCompute = this.info.compute.timestamp;
    this.addToAverage(this.totalGpuDurationCompute, this.averageGpuCompute);
  }
  updateAverages() {
    this.addToAverage(this.totalCpuDuration, this.averageCpu);
    this.addToAverage(this.totalGpuDuration, this.averageGpu);
  }
  resetCounters() {
    this.renderCount = 0;
    if (this.totalCpuDuration === 0) {
      this.beginProfiling("cpu-started");
    }
    this.totalCpuDuration = 0;
    this.totalFps = 0;
    this.beginTime = this.endInternal();
  }
  resizePanel(panel, offset) {
    panel.canvas.style.position = "absolute";
    if (this.minimal) {
      panel.canvas.style.display = "none";
    } else {
      panel.canvas.style.display = "block";
      if (this.horizontal) {
        panel.canvas.style.top = "0px";
        panel.canvas.style.left = offset * panel.WIDTH / panel.PR + "px";
      } else {
        panel.canvas.style.left = "0px";
        panel.canvas.style.top = offset * panel.HEIGHT / panel.PR + "px";
      }
    }
  }
  addPanel(panel, offset) {
    if (panel.canvas) {
      this.dom.appendChild(panel.canvas);
      this.resizePanel(panel, offset);
    }
    return panel;
  }
  showPanel(id) {
    for (let i = 0; i < this.dom.children.length; i++) {
      const child = this.dom.children[i];
      child.style.display = i === id ? "block" : "none";
    }
    this.mode = id;
  }
  processGpuQueries() {
    if (!this.gl || !this.ext)
      return;
    this.totalGpuDuration = 0;
    this.gpuQueries.forEach((queryInfo, index) => {
      if (this.gl) {
        const available = this.gl.getQueryParameter(queryInfo.query, this.gl.QUERY_RESULT_AVAILABLE);
        const disjoint = this.gl.getParameter(this.ext.GPU_DISJOINT_EXT);
        if (available && !disjoint) {
          const elapsed = this.gl.getQueryParameter(queryInfo.query, this.gl.QUERY_RESULT);
          const duration = elapsed * 1e-6;
          this.totalGpuDuration += duration;
          this.gl.deleteQuery(queryInfo.query);
          this.gpuQueries.splice(index, 1);
        }
      }
    });
  }
  endInternal() {
    this.frames++;
    const time = (performance || Date).now();
    const elapsed = time - this.prevTime;
    if (time >= this.prevCpuTime + 1e3 / this.logsPerSecond) {
      const fps = Math.round(this.frames * 1e3 / elapsed);
      this.addToAverage(fps, this.averageFps);
      this.updatePanel(this.fpsPanel, this.averageFps, 0);
      this.updatePanel(this.msPanel, this.averageCpu, this.precision);
      this.updatePanel(this.gpuPanel, this.averageGpu, this.precision);
      if (this.gpuPanelCompute) {
        this.updatePanel(this.gpuPanelCompute, this.averageGpuCompute);
      }
      this.frames = 0;
      this.prevCpuTime = time;
      this.prevTime = time;
    }
    return time;
  }
  addToAverage(value, averageArray) {
    averageArray.logs.push(value);
    if (averageArray.logs.length > this.samplesLog) {
      averageArray.logs.shift();
    }
    averageArray.graph.push(value);
    if (averageArray.graph.length > this.samplesGraph) {
      averageArray.graph.shift();
    }
  }
  beginProfiling(marker) {
    if (window.performance) {
      window.performance.mark(marker);
      this.isRunningCPUProfiling = true;
    }
  }
  endProfiling(startMarker, endMarker, measureName) {
    if (window.performance && endMarker && this.isRunningCPUProfiling) {
      window.performance.mark(endMarker);
      const cpuMeasure = performance.measure(measureName, startMarker, endMarker);
      this.totalCpuDuration += cpuMeasure.duration;
      this.isRunningCPUProfiling = false;
    }
  }
  updatePanel(panel, averageArray, precision = 2) {
    if (averageArray.logs.length > 0) {
      let sumLog = 0;
      let max = 0.01;
      for (let i = 0; i < averageArray.logs.length; i++) {
        sumLog += averageArray.logs[i];
        if (averageArray.logs[i] > max) {
          max = averageArray.logs[i];
        }
      }
      let sumGraph = 0;
      let maxGraph = 0.01;
      for (let i = 0; i < averageArray.graph.length; i++) {
        sumGraph += averageArray.graph[i];
        if (averageArray.graph[i] > maxGraph) {
          maxGraph = averageArray.graph[i];
        }
      }
      if (panel) {
        panel.update(sumLog / Math.min(averageArray.logs.length, this.samplesLog), sumGraph / Math.min(averageArray.graph.length, this.samplesGraph), max, maxGraph, precision);
      }
    }
  }
  get domElement() {
    return this.dom;
  }
  patchThreeRenderer(renderer) {
    const originalRenderMethod = renderer.render;
    const statsInstance = this;
    renderer.render = function(scene, camera) {
      statsInstance.begin();
      originalRenderMethod.call(this, scene, camera);
      statsInstance.end();
    };
    this.threeRendererPatched = true;
  }
};
_Stats.Panel = Panel;
let Stats = _Stats;
export {
  Stats as default
};
//# sourceMappingURL=main.js.map
