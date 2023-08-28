import * as L from 'leaflet';

const bbox = require('geojson-bbox');

const getEmptyFarmCenter = (farm: Farm): L.LatLng => {
  return new L.LatLng(farm.latitude, farm.longitude);
};

const getMultiFieldCenter = (fields: Field[]): L.LatLng => {
  const [minLng, minLat, maxLng, maxLat] = bbox({
    type: 'MultiPolygon',
    coordinates: fields.map((field: Field) => field.geometry.coordinates)
  });
  return new L.LatLng((minLat + maxLat) / 2, (minLng + maxLng) / 2);
};

export const calculateFarmViewport = (farm: Farm, fields: Field[]): L.LatLng => {
  if (!fields.length) {
    return getEmptyFarmCenter(farm);
  } else {
    return getMultiFieldCenter(fields);
  }
}

export const calculateFieldViewport = (field: Field): L.LatLng => {
  return getMultiFieldCenter([field]);
}