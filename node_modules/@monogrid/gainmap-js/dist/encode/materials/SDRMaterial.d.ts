import { ShaderMaterial, Texture, ToneMapping } from 'three';
/**
 * A Material used to adjust the SDR representation of an HDR image
 *
 * @category Materials
 * @group Materials
 */
export declare class SDRMaterial extends ShaderMaterial {
    private _brightness;
    private _contrast;
    private _saturation;
    private _exposure;
    private _toneMapping;
    private _map;
    /**
     *
     * @param params
     */
    constructor({ map, toneMapping }: {
        map: Texture;
        toneMapping?: ToneMapping;
    });
    get toneMapping(): ToneMapping;
    set toneMapping(value: ToneMapping);
    get brightness(): number;
    set brightness(value: number);
    get contrast(): number;
    set contrast(value: number);
    get saturation(): number;
    set saturation(value: number);
    get exposure(): number;
    set exposure(value: number);
    get map(): Texture;
    set map(value: Texture);
}
