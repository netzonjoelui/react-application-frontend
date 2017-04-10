/**
* @fileOverview Location adaptor that uses hash
*
* @author:  Sky Stebnicki, sky.stebnicki@aereus.com; 
*       Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

/**
 * Get the window has adaptor
 *
 * @constructor
 */
var Hash = function() {

  /**
   * Type of action last performed
   * 
   * @type {location.actions}
   */
  this.actionType_ = null;

  /**
   * Local renference to netric.location object
   *
   * type {location}
   */
  this.netricLocation_ = require("../location.js");

  // Begin listening for hash changes
  alib.events.listen(window, "hashchange", function(evt) {
    // Check to see if we changes
    if (this.ensureSlash_()){
      // If we don't have an actionType_ then all we know is the hash
      // changed. It was probably caused by the user clicking the Back
      // button, but may have also been the Forward button or manual
      // manipulation. So just guess 'pop'.
      this.notifyChange_(this.actionType_ || this.netricLocation_.actions.POP);
      this.actionType_ = null;  
    }
  }.bind(this));
  
}

/**
 * A new location has been pushed onto the stack
 *
 * @param {string} path The path to push onto the history statck
 */
Hash.prototype.push = function (path) {
  this.actionType_ = this.netricLocation_.actions.PUSH;
  window.location.hash = this.netricLocation_.path.encode(path);
}

/**
 * The current location should be replaced
 *
 * @param {string} path The path to push onto the history statck
 */
Hash.prototype.replace = function (path) {
  this.actionType_ = location.actions.REPLACE;
  window.location.replace(window.location.pathname + window.location.search + '#' + this.netricLocation_.path.encode(path));
}

/**
 * The most recent path should be removed from the history stack
 */
Hash.prototype.pop = function () {
    this.actionType_ = this.netricLocation_.actions.POP;
    History.back();
}

/**
 * Get the current path from the 'hash' including query string
 */
Hash.prototype.getCurrentPath = function () {
  return this.netricLocation_.path.decode(
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    window.location.href.split('#')[1] || ''
  );
}

/**
 * Get the root relative to the current path
 */
Hash.prototype.getRelativeRoot = function () {
    // Since hash is always on the root then just return .
    return ".";
}

/**
 * Assure that the path begins with a slash '/'
 */
Hash.prototype.ensureSlash_ = function() {
  var path = this.getCurrentPath();

  if (path.charAt(0) === '/')
    return true;

  this.replace('/' + path);

  return false;
}

/**
 * Notify the listeners that the location has changed
 */
Hash.prototype.notifyChange_ = function(type) {
  //if (type === this.netricLocation_.actions.PUSH)
    //History.length += 1;

  var data = {
    path: this.getCurrentPath(),
    type: type
  };

  alib.events.triggerEvent(this, "pathchange", data);
}

module.exports = Hash;
