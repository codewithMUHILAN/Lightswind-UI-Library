export type JPEGRInfo = {
  width: number,
  height: number
};

export type UltraHDRMetadata = {
  version: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string,
  gamma: number,
  hdrCapacityMax: number,
  hdrCapacityMin: number,
  maxContentBoost: number,
  minContentBoost: number,
  offsetHdr: number,
  offsetSdr: number
};

export type UltraHDRUnpacked = {
  metadata: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string,
  success: boolean,
  errorMessage: any,
  sdr: any,
  gainMap: any
};

export interface MainModule {
  getExceptionMessage(_0: number): ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
  getJPEGRInfo(_0: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string, _1: number): JPEGRInfo;
  extractJpegR(_0: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string, _1: number): UltraHDRUnpacked;
  appendGainMap(_0: number, _1: number, _2: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string, _3: number, _4: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string, _5: number, _6: number, _7: number, _8: number, _9: number, _10: number, _11: number, _12: number): any;
}
