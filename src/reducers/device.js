import * as ActionTypes from '../actions';
import {deviceSizes} from '../models/device';

/**
 * Define the default structure of our state
 */
const initialState = {
  online: true,
  size: deviceSizes.small
};

/**
 * Handle device transformations
 */
const device = (state = initialState, action) => {

  /**
   * Set the online status of this device
   */
  if (action.type === ActionTypes.DEVICE_UPDATE_ONLINE) {
    return Object.assign({}, state, {
      online: action.status
    });
  }

  /**
   * Set the size of the current device
   */
  if (action.type === ActionTypes.DEVICE_UPDATE_SIZE) {
    return Object.assign({}, state, {
      size: action.size
    });
  }

  return state
};


export default device;
