import { useState } from 'react';
import { Moment } from 'moment';

import type { Polygon } from 'geojson';

import {
  createFarm,
  createField,
  createTrackingJob,
  listFarms,
  listFields,
  listTrackingJobs
} from '../services/FarmService';

export default function FarmProvider() {

  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [trackingJobs, setTrackingJobs] = useState<TrackingJob[]>([]);

  const [selectedFarm, setSelectedFarm] = useState<Farm|null>(null);
  const [selectedField, setSelectedField] = useState<Field|null>(null);
  const [selectedTrackingJob, setSelectedTrackingJob] = useState<TrackingJob|null>(null);

  return {
    farms,
    fields,
    trackingJobs,

    selectedFarm,
    selectedField,
    selectedTrackingJob,

    fetchFarms: () => listFarms().then(farms => {
      setFarms(farms); return farms;
    }),

    fetchFields: (farm: Farm) => listFields(farm.id).then(fields => {
      setFields(fields); return fields;
    }),

    fetchTrackingJobs: (field: Field) => listTrackingJobs(field.id).then(trackingJobs => {
      setTrackingJobs(trackingJobs); return trackingJobs;
    }),

    selectFarm: (farm: Farm) => {
      setSelectedFarm(farm);
      setSelectedField(null);
      setSelectedTrackingJob(null);
    },

    selectField: (field: Field) => {
      setSelectedField(field);
      setSelectedTrackingJob(null);
    },

    selectTrackingJob: (trackingJob: TrackingJob) => {
      setSelectedTrackingJob(trackingJob);
    },

    createFarm: (name: string, latitude: number, longitude: number): Promise<Farm> => {
      return new Promise((resolve, reject) =>
        createFarm(name, latitude, longitude).then(farmId =>
          listFarms().then(farms => {
            setFarms(farms);
            setFields([]);
            setTrackingJobs([]);
            const farm = farms.find(f => f.id === farmId)!;
            setSelectedFarm(farm);
            resolve(farm);
          }).catch(reject)
        ).catch(reject)
      );
    },

    createField: (farm: Farm, name: string, cropType: string, geometry: Polygon): Promise<Field> => {
      return new Promise((resolve, reject) =>
        createField(farm.id, name, cropType, geometry).then(fieldId =>
          listFields(farm.id).then(fields => {
            setFields(fields);
            setTrackingJobs([]);
            const field = fields.find(f => f.id === fieldId)!;
            setSelectedField(field);
            resolve(field);
          }).catch(reject)
        ).catch(reject)
      );
    },

    createTrackingJob: (field: Field, date: Moment): Promise<TrackingJob> => {
      return new Promise((resolve, reject) =>
        createTrackingJob(field.id, date).then(trackingJobId =>
          listTrackingJobs(field.id).then(trackingJobs => {
            setTrackingJobs(trackingJobs);
            const trackingJob = trackingJobs.find(t => t.id === trackingJobId)!;
            setSelectedTrackingJob(trackingJob);
            resolve(trackingJob);
          }).catch(reject)
        ).catch(reject)
      );
    }
  };
}