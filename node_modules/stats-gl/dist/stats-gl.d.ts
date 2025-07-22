declare class Panel {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    name: string;
    fg: string;
    bg: string;
    gradient: CanvasGradient | null;
    PR: number;
    WIDTH: number;
    HEIGHT: number;
    TEXT_X: number;
    TEXT_Y: number;
    GRAPH_X: number;
    GRAPH_Y: number;
    GRAPH_WIDTH: number;
    GRAPH_HEIGHT: number;
    constructor(name: string, fg: string, bg: string);
    private createGradient;
    private initializeCanvas;
    update(value: number, valueGraph: number, maxValue: number, maxGraph: number, decimals?: number): void;
}

interface StatsOptions {
    trackGPU?: boolean;
    logsPerSecond?: number;
    samplesLog?: number;
    samplesGraph?: number;
    precision?: number;
    minimal?: boolean;
    horizontal?: boolean;
    mode?: number;
}
declare class Stats {
    private dom;
    private mode;
    private horizontal;
    private minimal;
    private trackGPU;
    private samplesLog;
    private samplesGraph;
    private precision;
    private logsPerSecond;
    private gl;
    private ext;
    private info?;
    private activeQuery;
    private gpuQueries;
    private threeRendererPatched;
    private beginTime;
    private prevTime;
    private prevCpuTime;
    private frames;
    private renderCount;
    private isRunningCPUProfiling;
    private totalCpuDuration;
    private totalGpuDuration;
    private totalGpuDurationCompute;
    private totalFps;
    private fpsPanel;
    private msPanel;
    private gpuPanel;
    private gpuPanelCompute;
    private averageFps;
    private averageCpu;
    private averageGpu;
    private averageGpuCompute;
    static Panel: typeof Panel;
    constructor({ trackGPU, logsPerSecond, samplesLog, samplesGraph, precision, minimal, horizontal, mode }?: StatsOptions);
    private initializeDOM;
    private setupEventListeners;
    private handleClick;
    private handleResize;
    init(canvasOrGL: WebGL2RenderingContext | HTMLCanvasElement | OffscreenCanvas | any): Promise<void>;
    private handleThreeRenderer;
    private handleWebGPURenderer;
    private initializeWebGPUPanels;
    private initializeWebGL;
    private initializeGPUTracking;
    begin(): void;
    end(): void;
    update(): void;
    private processWebGPUTimestamps;
    private updateAverages;
    private resetCounters;
    resizePanel(panel: Panel, offset: number): void;
    addPanel(panel: Panel, offset: number): Panel;
    showPanel(id: number): void;
    processGpuQueries(): void;
    endInternal(): number;
    addToAverage(value: number, averageArray: {
        logs: any;
        graph: any;
    }): void;
    beginProfiling(marker: string): void;
    endProfiling(startMarker: string | PerformanceMeasureOptions | undefined, endMarker: string | undefined, measureName: string): void;
    updatePanel(panel: {
        update: any;
    } | null, averageArray: {
        logs: number[];
        graph: number[];
    }, precision?: number): void;
    get domElement(): HTMLDivElement;
    patchThreeRenderer(renderer: any): void;
}

export { Stats as default };
