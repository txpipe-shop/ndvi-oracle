import geotiff from 'geotiff'
import { ColorBandInfo, HtmlOrNodeCanvas } from '.'

export async function paintColorGeotiff(
  band: ColorBandInfo,
  canvas: HtmlOrNodeCanvas
): Promise<void> {
  canvas.width = band.width
  canvas.height = band.height

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(band.width, band.height)
  const data = imageData.data

  let o = 0
  for (let i = 0; i < band.raster[0].length; i += 1) {
    data[o] = band.raster[0][i]
    data[o + 1] = band.raster[1][i]
    data[o + 2] = band.raster[2][i]
    data[o + 3] =
      band.raster[0][i] + band.raster[1][i] + band.raster[2][i] === 0 ? 0 : 255
    o += 4
  }

  ctx.putImageData(imageData, 0, 0)
}
