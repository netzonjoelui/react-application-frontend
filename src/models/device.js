/**
 * Functions for managing and detecting the device
 */

/**
 * Constants for application size
 *
 * @type {string}
 */
// Phones and small devices < 768px wide
export const DEVICE_SMALL = 1;
// Tablets >768px but <1200px wide
export const DEVICE_MEDIUM = 3;
// Desktops >=1200px but <1200px wide
export const DEVICE_LARGE = 5;
// // Big Desktops > 1200px
export const DEVICE_XLARGE = 7;

/**
 * Export all sizes
 */
export const deviceSizes = {
  small: DEVICE_SMALL,
  medium: DEVICE_MEDIUM,
  large: DEVICE_LARGE,
  xlarge: DEVICE_XLARGE
};

/**
 * Constants for platforms
 *
 * @type {string}
 */
export const PLATFORM_ANDROID = 'android';
export const PLATFORM_IOS = 'ios';
export const PLATFORM_WINDOWS = 'windows';

/**
 * Export all platforms
 */
export const devicePlatforms = {
  android: PLATFORM_ANDROID,
  ios: PLATFORM_IOS,
  windows: PLATFORM_WINDOWS
};

/**
 * Function to detect the device size
 *
 * @returns {string} const DEVICE_*
 */
export const getDeviceSize = () => {
  let width = alib.dom.getClientWidth();

  if (width <= 768) {
    return DEVICE_SMALL;
  } else if (width >= 768 && width < 1080) {
    return DEVICE_MEDIUM;
  } else if (width >= 1080 && width < 1200) {
    return DEVICE_LARGE;
  } else if (width >= 1200) {
    return DEVICE_XLARGE;
  }
};

/**
 * Function to detect the size height of web browser application
 *
 * @returns {number} height of the web browser applcation*
 */
export const getDeviceHeight = () => {
  return alib.dom.getClientHeight();
};
