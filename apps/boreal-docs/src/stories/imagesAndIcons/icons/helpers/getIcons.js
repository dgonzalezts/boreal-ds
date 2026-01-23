import { PREFIX, PSEUDO_CLASS } from '../constants/Prefix';
import Icons from './icons.json';

const getData = async () => {
  try {
    // Mocking the fetch call
    return new Promise(res => {
      res(Icons);
    });
  } catch (e) {
    console.log('Error getting icons:', e);
  }
};

export const createIconData = async () => {
  try {
    return getData();
  } catch (error) {
    console.error('Error creating icon data:', error);
    return [];
  }
};
