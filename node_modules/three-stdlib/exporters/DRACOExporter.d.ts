import * as THREE from 'three'

declare class DRACOExporter {
  // Encoder methods

  public static MESH_EDGEBREAKER_ENCODING: number
  public static MESH_SEQUENTIAL_ENCODING: number

  // Geometry type

  public static POINT_CLOUD: number
  public static TRIANGULAR_MESH: number

  // Attribute type
  public static INVALID: number
  public static POSITION: number
  public static NORMAL: number
  public static COLOR: number
  public static TEX_COORD: number
  public static GENERIC: number

  public parse(
    object: THREE.Mesh | THREE.Points,
    options?: {
      decodeSpeed?: number
      encodeSpeed?: number
      encoderMethod?: number
      quantization?: [number, number, number, number, number]
      exportUvs?: boolean
      exportNormals?: boolean
      exportColor?: boolean
    },
  ): Int8Array
}

export { DRACOExporter }
