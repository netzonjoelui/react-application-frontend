/**
 * Action types
 *
 * @type {string}
 */
export const DEVICE_UPDATE_ONLINE = 'DEVICE_UPDATE_ONLINE';
export const DEVICE_UPDATE_SIZE  = 'DEVICE_UPDATE_SIZE';

/**
 * Update the online status of this device
 *
 * @param {bool} status
 * @returns {{type: string, status: bool}}
 */
export const updateOnline = (status) => {
  return { type: DEVICE_UPDATE_ONLINE, status:status };
};

/**
 * Update the size of the current device
 *
 * @param {string} size Constant from ../models/device.deviceSizes
 * @returns {{type: string, size: string}}
 */
export const updateSize = (size) => {
  return { type: DEVICE_UPDATE_SIZE, size:size };
};
