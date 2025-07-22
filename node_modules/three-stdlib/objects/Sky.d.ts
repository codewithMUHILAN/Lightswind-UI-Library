import { Mesh, BoxGeometry, ShaderMaterial, Vector3 } from 'three'

declare class Sky extends Mesh<BoxGeometry, ShaderMaterial> {
  static SkyShader: {
    uniforms: {
      turbidity: { value: number }
      rayleigh: { value: number }
      mieCoefficient: { value: number }
      mieDirectionalG: { value: number }
      sunPosition: { value: Vector3 }
      up: { value: Vector3 }
    }
  }

  static material: ShaderMaterial
}

export { Sky }
