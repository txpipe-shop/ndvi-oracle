import * as React from 'react';
import * as L from 'leaflet';
import { ImageOverlay } from 'react-leaflet';
import type { Polygon } from 'geojson';
const bbox = require('geojson-bbox');

interface Props {
  id: string;
  geometry: Polygon;
  imageUrl: string;
  onClick?: () => void;
}

export default class ColorRasterOverlay extends React.Component<Props> {
  render() {
    const { id, geometry, imageUrl, onClick } = this.props;
    const box = bbox(geometry);

    const corner1 = L.latLng(box[1], box[0]);
    const corner2 = L.latLng(box[3], box[2]);
    const bounds = L.latLngBounds(corner1, corner2);

    return (
      <ImageOverlay
        key={id}
        className="pixelated"
        bounds={bounds}
        url={imageUrl}
        interactive={onClick ? true : false}
        eventHandlers={{click: onClick}}
      />
    );
  }
}
