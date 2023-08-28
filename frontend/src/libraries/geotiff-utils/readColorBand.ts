import geotiff from 'geotiff'
import { ColorBandInfo } from '.'

export default async function(buffer: ArrayBuffer): Promise<ColorBandInfo> {
  const tiff = await geotiff.fromArrayBuffer(buffer)
  const band = await tiff.getImage()
  const raster = await band.readRasters()
  const width = band.getWidth()
  const height = band.getHeight()

  return {
    raster,
    width,
    height
  }
}
