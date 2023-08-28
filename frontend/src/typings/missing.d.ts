declare module 'geotiff' {
  type Raster = Uint8Array | Float32Array;
  interface Image {
    readRasters(): Promise<Raster[]>
    getWidth(): number
    getHeight(): number
    getSamplesPerPixel(): number
  }
  interface Tiff {
    getImage(index?: number): Promise<Image>
  }
  export function fromArrayBuffer(buffer: ArrayBuffer): Promise<Tiff>
}
