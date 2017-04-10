/**
 * @fileoverview Device information class
 * 
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
 * 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
 */
'use strict';

// Information about the current device
var Device = function() {
	
	// Try to determine the current devices size
	this.getDeviceSize_();

	/**
	 * Attempt to determine our platform
	 *
	 * @type {Device.platforms}
	 */
	this.platform = this.getDevicePlatform_();
}

/**
 * Static device sizes
 * 
 * @const
 * @public
 */
Device.sizes = {
	// Phones and small devices < 768px wide
	small : 1,
	// Tablets >768px but <1200px wide
	medium : 3,
	// Desktops >=1200px but <1200px wide
	large : 5,
	// Big Desktops
	xlarge : 7
};

/**
 * Static device platforms
 * 
 * @const
 * @public
 */
Device.platforms = {
	// Google Android
	android : 1,
	// Apple iOS
	ios : 3,
	// Microsoft Windows
	windows : 5
};

/**
 * The size of the current device once loaded
 *
 * @type {Device.sizes}
 */
Device.prototype.size = Device.sizes.large;

/**
 * Detect the size of the current device and set this.size
 *
 * @private
 */
 Device.prototype.getDeviceSize_ = function() {
 	
 	var width = alib.dom.getClientWidth();
 	
 	if (width <= 768) {
 		this.size = Device.sizes.small;
 	} else if (width >= 768 && width < 1080) {
 		this.size = Device.sizes.medium;
 	} else if (width >= 1080 && width < 1200) {
 		this.size = Device.sizes.large;
	} else if (width >= 1200) {
		this.size = Device.sizes.xlarge;
	}
 }

 /**
  * Detect the size of the current device and set this.size
  *
  * @private
  */
 Device.prototype.getDevicePlatform_ = function() {
 	// TODO: Detect platform here
 }

 /**
  * Try to determine if a device is connected
  *
  * It is more likely that this function return a false
  * positive than a false negative so use it assuming that (1)
  * it is likely that it returns true even if there are connection
  * problems (like the server being down or non-public netric)
  * (2) if it returns false that should be considered pretty reliable.
  *
  * @return {bool} true if connected, false if offline
  */
 Device.prototype.isOnline = function() {

 	// Try HTML5 navigator.online status
 	if (navigator && navigator.onLine) {
 		return navigator.onLine;
 	}

 	// Assume true
 	return true;
 }
 

 module.exports = Device;
 