import React from 'react';

interface Props {
  show: boolean;
  onCreateFarm: (name: string, latitude: number, longitude: number) => void;
  onDismiss: () => void;
}

export default function AddFarmModal(props: Props) {

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      farmName: { value: string };
      latitude: { value: string };
      longitude: { value: string };
    };
    props.onCreateFarm(
      target.farmName.value,
      parseFloat(target.latitude.value),
      parseFloat(target.longitude.value)
    );
  };

  if (!props.show) return null;

  return (
    <div className="w-full h-full fixed top-0 left-0 z-[1000] overflow-x-hidden overflow-y-auto bg-gray-900/60">
      <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-16rem)] flex items-center">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl md:max-w-2xl md:w-full m-3 md:mx-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-bold text-gray-800">
              Create a new farm
            </h3>
            <button
              type="button"
              onClick={props.onDismiss}
              className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="p-4 overflow-y-auto">
              <input
                type="text"
                name="farmName"
                autoFocus={true}
                required={true}
                placeholder="Farm Name"
                className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="mt-4 flex">
                <input
                  type="text"
                  name="latitude"
                  required={true}
                  placeholder="Latitude"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 flex-1 mr-2"
                />
                <input
                  type="text"
                  name="longitude"
                  required={true}
                  placeholder="Longitude"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 flex-1 ml-2"
                />
              </div>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
              <button type="submit" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
