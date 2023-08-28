
interface Farm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Field {
  id: string;
  name: string;
  cropType: string;
  geometry: Polygon;
}

interface TrackingJob {
  id: string;
  date: string;
  raster: RasterDocument;
}

interface RasterDocument {
  kind: string;
  thumbnailUrl: string;
  rasterUrl: string;
  bins: NdviRasterBins;
}

interface NdviRasterBin {
  min: number;
  max: number;
  color: string;
}

type NdviRasterBins = NdviRasterBin[];

interface QuantifiedBin extends NdviRasterBin {
  pixels: number;
  area: number;
}
