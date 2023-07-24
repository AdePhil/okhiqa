import {MMKV} from 'react-native-mmkv';

export const STORAGE_KEYS = {
  USER: 'USER',
  LOCATION: 'LOCATION',
};

export const storage = new MMKV();

export const get = (key: string) => {
  const data = storage.getString(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
};

export const set = (key: string, value: any) =>
  storage.set(key, JSON.stringify(value));

export const remove = (key: string) => storage.delete(key);

export default {get, remove, set, keys: STORAGE_KEYS};
