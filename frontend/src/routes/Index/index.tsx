import { useState, useRef, useEffect } from 'react';
import { Moment } from 'moment';

import Sidebar from './Sidebar';
import Map from './Map';
import { AddFarmModal, AddFieldModal, AddTrackingJobModal} from '../../components';
import FarmProvider from '../../providers/FarmProvider';

import type { Feature, Polygon } from 'geojson';
import type { MapHandler } from './Map';

import './index.css';

export default function Index() {
  const mapRef = useRef<MapHandler>(null);
  const provider = FarmProvider();
  const [showAddFarmModal, setShowAddFarmModal] = useState<boolean>(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState<boolean>(false);
  const [showAddTrackingJobModal, setShowAddTrackingJobModal] = useState<boolean>(false);
  const [temporalPolygon, setTemporalPolygon] = useState<Feature<Polygon>|null>(null);

  useEffect(() => { provider.fetchFarms() }, []);

  const onCreateFarm = (name: string, latitude: number, longitude: number) => {
    setShowAddFarmModal(false);
    provider.createFarm(name, latitude, longitude)
      .then(farm => mapRef.current!.selectFarm(farm, []));
  };

  const onSelectFarm = (farm: Farm) => {
    provider.selectFarm(farm);
    provider.fetchFields(farm)
      .then(fields => mapRef.current!.selectFarm(farm, fields));
  };

  const onRestartDraw = () => {
    setShowAddFieldModal(false);
    mapRef.current!.startDraw();
  };

  const onDismissDraw = () => {
    setShowAddFieldModal(false);
    setTemporalPolygon(null);
  };

  const onDrawField = (polygon: Feature<Polygon>) => {
    setTemporalPolygon(polygon);
    setShowAddFieldModal(true);
  };

  const onCreateField = (name: string, cropType: string) => {
    setShowAddFieldModal(false);
    provider.createField(provider.selectedFarm!, name, cropType, temporalPolygon!.geometry)
      .then(field => {
        setTemporalPolygon(null);
        mapRef.current!.selectField(field);
      }); 
  };

  const onSelectField = (field: Field) => {
    provider.selectField(field);
    provider.fetchTrackingJobs(field);
    mapRef.current!.selectField(field);
  };

  const onCreateTrackingJob = (date: Moment) => {
    setShowAddTrackingJobModal(false);
    provider.createTrackingJob(provider.selectedField!, date);
  };

  const onSelectTrackingJob = (trackingJob: TrackingJob) => {
    provider.selectTrackingJob(trackingJob);
  }

  return (
    <div className="flex flex-1">
      <Sidebar
        farms={provider.farms}
        fields={provider.fields}
        trackingJobs={provider.trackingJobs}
        selectedFarm={provider.selectedFarm}
        selectedField={provider.selectedField}
        selectedTrackingJob={provider.selectedTrackingJob}
        onAddFarm={() => setShowAddFarmModal(true)}
        onAddField={() => mapRef.current!.startDraw()}
        onAddTrackingJob={() => setShowAddTrackingJobModal(true)}
        onSelectFarm={onSelectFarm}
        onSelectField={onSelectField}
        onSelectTrackingJob={onSelectTrackingJob}
      />
      <Map
        ref={mapRef}
        fields={provider.fields}
        farm={provider.selectedFarm}
        field={provider.selectedField}
        trackingJob={provider.selectedTrackingJob}
        onDrawField={onDrawField}
        onSelectField={onSelectField}
      />
      <AddFarmModal
        show={showAddFarmModal}
        onCreateFarm={onCreateFarm}
        onDismiss={() => setShowAddFarmModal(false)}
      />
      <AddFieldModal
        show={showAddFieldModal}
        onCreateField={onCreateField}
        onRestartDraw={onRestartDraw}
        onDismiss={onDismissDraw}
      />
      <AddTrackingJobModal
        show={showAddTrackingJobModal}
        onCreateTrackingJob={onCreateTrackingJob}
        onDismiss={() => setShowAddTrackingJobModal(false)}
      />
    </div>
  );
}
