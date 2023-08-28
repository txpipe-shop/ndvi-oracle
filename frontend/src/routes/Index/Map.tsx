import * as L from 'leaflet';
import 'leaflet-draw';

import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';

import { GeotiffOverlay, HistogramChart, BinLegend } from '../../components';
import sanitizePolygon from '../../utils/sanitizePolygon';
import { inferRasterProperties } from '../../utils';
import { calculateFarmViewport, calculateFieldViewport } from '../../utils/ViewportCalculator';
import { GeotiffRender } from '../../utils/renderGeotiffRaster';

import type { Feature, Polygon } from 'geojson';

interface Props {
  fields: Field[];
  farm: Farm | null;
  field: Field | null;
  trackingJob: TrackingJob | null;
  onDrawField: (polygon: Feature<Polygon>) => void;
  onSelectField: (field: Field) => void;
}

export interface MapHandler {
  selectFarm: (farm: Farm, fields: Field[]) => void;
  selectField: (field: Field) => void;
  startDraw: () => void;
}

const DEFAULT_CENTER = new L.LatLng(-37.31013, -59.636838);
const DEFAULT_ZOOM = 6;
const FOCUS_FARM_ZOOM = 13;
const FOCUS_FIELD_ZOOM = 14;

const Map = (props: Props, ref: React.Ref<MapHandler>) => {

  const [mapRef, setMapRef] = useState<L.Map|null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [render, setRender] = useState<GeotiffRender|null>(null);
  const rasterProps = props.trackingJob !== null ? inferRasterProperties(props.trackingJob.raster) : null;

  useImperativeHandle(ref,() => ({
    selectFarm(farm: Farm, fields: Field[]) { selectFarm(farm, fields); },
    selectField(field: Field) { selectField(field); },
    startDraw() { startDraw(); }
  }), [mapRef]);

  const selectFarm = (farm: Farm, fields: Field[]) => {
    if (mapRef != null) {
      mapRef.setView(calculateFarmViewport(farm, fields), FOCUS_FARM_ZOOM);
    }
  };

  const selectField = (field: Field) => {
    if (mapRef != null) {
      mapRef.setView(calculateFieldViewport(field), FOCUS_FIELD_ZOOM);
    }
  };

  const startDraw = () => {
    setDrawing(true);

    const drawer = new L.Draw.Polygon(mapRef as L.DrawMap);

    drawer.setOptions({
      icon: new L.DivIcon({
        iconSize: new L.Point(8, 8)
      })
    });

    mapRef!.once(L.Draw.Event.CREATED, (event: L.LeafletEvent) => {
      const feature = event.layer.toGeoJSON() as Feature<Polygon>;
      feature.geometry.coordinates = sanitizePolygon(feature.geometry.coordinates);
      props.onDrawField(feature);
    });

    mapRef!.once(L.Draw.Event.DRAWSTOP, () => {
      setDrawing(false);
    });

    drawer.enable();
  };

  const displayMap = useMemo(() => (
    <MapContainer
      className="h-screen"
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      ref={setMapRef}
    >

      <TileLayer
        url={`http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}`}
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
      />

      {props.farm !== null && (
        <FeatureGroup>
          {props.fields.map(field =>
            <GeoJSON
              key={field.id}
              data={field.geometry}
              style={{
                color: props.field && props.field.id === field.id ? '#F00' : '#0F0',
                weight: 3
              }}
              eventHandlers={{
                click: () => props.onSelectField(field)
              }}
            />
          )}

          {props.trackingJob !== null && (
            <GeotiffOverlay
              id={props.trackingJob.id.toString()}
              geotiffUrl={props.trackingJob.raster.rasterUrl}
              geotiffType={rasterProps!.type}
              inputDomain={rasterProps!.inputDomain}
              outputDomain={rasterProps!.outputDomain}
              nodata={rasterProps!.nodata}
              geometry={props.field!.geometry}
              customBins={props.trackingJob.raster.bins}
              onRender={setRender}
            />
          )}
        </FeatureGroup>
      )}

      <Control prepend position='topright'>
        {props.trackingJob !== null && render !== null && (
          <div className="bg-white border shadow-sm rounded-md">
            <HistogramChart
              height={180}
              width={320}
              histogram={render.histogram!}
              bins={render.bins!}
            />
            <BinLegend
              histogram={render.histogram!}
              bins={render.bins!}
              totalArea={20}
            />
          </div>
        )}
      </Control>

    </MapContainer>
  ), [
    props.fields,
    props.farm,
    props.field,
    props.trackingJob,
    render
  ]);

  return (
    <div className="flex-1 relative">
      {displayMap}
      {drawing && (
        <div className="w-full absolute top-0 flex justify-center" style={{ zIndex: 1000 }}>
          <div className="bg-blue-500 text-white border border-blue-700 rounded-md shadow-lg flex-0 mt-3">
            <div className="flex p-4">
              <div className="flex-shrink-0">
                <i className="bi bi-info-circle-fill h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm mt-0.5">
                  Click on the map to start drawing the field
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(Map);