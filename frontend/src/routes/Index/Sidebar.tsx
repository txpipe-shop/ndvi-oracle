import React from 'react';

interface Props {
  farms: Farm[];
  fields: Field[];
  trackingJobs: TrackingJob[];
  selectedFarm: Farm | null;
  selectedField: Field | null;
  selectedTrackingJob: TrackingJob | null;
  onAddFarm: () => void;
  onAddField: () => void;
  onAddTrackingJob: () => void;
  onSelectFarm: (farm: Farm) => void;
  onSelectField: (field: Field) => void;
  onSelectTrackingJob: (trakingJob: TrackingJob) => void;
}

const FarmsSection = (props: Props) => (
  <>
    <div className="px-6 mb-2">
      <h3 className="text-lg text-gray-800">
        Farms
      </h3>
    </div>
    { props.farms.length > 0 && (
      <div className="px-5 mb-2 flex flex-col">
        { props.farms.map((farm, index) =>
          <button
            key={index}
            type="button"
            className={props.selectedFarm && props.selectedFarm.id === farm.id ? 'sidebar-button-active' : 'sidebar-button'}
            onClick={() => props.onSelectFarm(farm)}
          >
            <span className="sidebar-button-title">
              {farm.name}
            </span>
          </button>
        )}
      </div>
    )}
    <div className="px-5 flex flex-col">
      <button type="button" className="sidebar-button" onClick={props.onAddFarm}>
        <i className="bi bi-plus-circle-fill" />
        Add Farm
      </button>
    </div>
  </>
);

const FieldsSection = (props: Props) => {
  return (
    <>
      <div className="px-6 mt-6 mb-2">
        <h3 className="text-lg text-gray-800">
          Fields
        </h3>
      </div>
      { props.fields.length > 0 && (
        <div className="px-5 mb-2 flex flex-col">
          { props.fields.map((field, index) =>
            <button
              key={index}
              type="button"
              className={props.selectedField && props.selectedField.id === field.id ? 'sidebar-button-active' : 'sidebar-button'}
              onClick={() => props.onSelectField(field)}
            >
              <span className="sidebar-button-title">
                {field.name}
              </span>
              <span className="sidebar-button-badge">
                {field.cropType}
              </span>
            </button>
          )}
        </div>
      )}
      <div className="px-5 flex flex-col">
        <button type="button" className="sidebar-button" onClick={props.onAddField}>
          <i className="bi bi-plus-circle-fill" />
          Add Field
        </button>
      </div>
    </>
  );
};

const TrackingJobsSection = (props: Props) => {
  return (
    <>
      <div className="px-6 mt-6 mb-2">
        <h3 className="text-lg text-gray-800">
          Tracking Jobs
        </h3>
      </div>
      { props.trackingJobs.length > 0 && (
        <div className="px-5 mb-2 flex flex-col">
          { props.trackingJobs.map((trackingJob, index) =>
            <button
              key={index}
              type="button"
              className={props.selectedTrackingJob && props.selectedTrackingJob.id === trackingJob.id ? 'sidebar-button-active' : 'sidebar-button'}
              onClick={() => props.onSelectTrackingJob(trackingJob)}
            >
              <span className="sidebar-button-title">
                {trackingJob.date}
              </span>
            </button>
          )}
        </div>
      )}
      <div className="px-5 flex flex-col">
        <button type="button" className="sidebar-button" onClick={props.onAddTrackingJob}>
          <i className="bi bi-plus-circle-fill" />
          Create Tracking Job
        </button>
      </div>
    </>
  );
};

export default function Sidebar(props: Props) {
  return (
    <div className="flex-0 basis-80 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y">
      <div className="px-6 mb-4">
        <p className="flex-none text-xl font-semibold">
          NDVI Oracle
        </p>
      </div>
      <FarmsSection {...props} />
      { props.selectedFarm !== null && <FieldsSection {...props} /> }
      { props.selectedField !== null && <TrackingJobsSection {...props} /> }
    </div>
  );
}
