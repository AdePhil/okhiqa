import {useState} from 'react';
import store from '../store';
import {OkHiLocation} from 'react-native-okhi';

const useLocations = () => {
  const [locations, setLocations] = useState<OkHiLocation[]>(
    () => (store.get(store.keys.LOCATION) ?? []) as OkHiLocation[],
  );
  const addLocation = (location: OkHiLocation) => {
    const newLocations = [...locations, location];
    setLocations(newLocations);
    store.set(store.keys.LOCATION, newLocations);
  };
  const removeLocation = (locationId: string) => {
    const newLocations = [...locations.filter(loc => loc.id !== locationId)];
    setLocations(newLocations);
    store.set(store.keys.LOCATION, newLocations);
  };
  return {
    locations,
    addLocation,
    removeLocation,
  };
};

export default useLocations;
