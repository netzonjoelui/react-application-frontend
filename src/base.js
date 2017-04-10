/**
* @fileOverview Base namespace for netric
*
* @author:	Sky Stebnicki, sky.stebnicki@aereus.com; 
* 			Copyright (c) 2014 Aereus Corporation. All rights reserved.
*/

var server = require("./server");

/**
 * The root namespace for all netric code
 */
var netric = {};

/**
 * Set version
 *
 * @public
 * @type {string}
 */
netric.version = "2.0.1";

/**
 * Netric server object
 *
 * @public
 * @var {Object}
 */
netric.server = server;

/**
 * Private reference to initialized applicaiton
 *
 * This will be set in netric.Application.load and should be used
 * with caution making sure all supporting code is called after the
 * main applicaiton has been initialized.
 *
 * @private
 * @var {netric.Application}
 */
 netric.application_ = null;

 /**
  * Get account base uri for building links
  * 
  * We need to do this because accounts are represented with
  * third level domains, like aereus.netric.com, where 'aereus'
  * is the name of the account.
  * 
  * @public
  * @return {string} URI
  */
netric.getBaseUri = function()
{
	var uri = window.location.protocol+'//'+window.location.hostname+(window.location.port 
		? ':' + window.location.port
		: '');
	return uri;
}

/**
 * Get initailized application
 *
 * @throws {Exception} If application has not yet been loaded
 * @return {netric.Application|bool}
 */
netric.getApplication = function() {
	if (this.application_ === null) {
		throw new Error("An instance of netric.Application has not yet been loaded.");
	}

	return this.application_;
}

/**
 * Set the current running applicaiton
 * 
 * This is called in netric.Application.run
 *
 * @param {netric.Application}
 */
netric.setApplication = function(application) {
  this.application_ = application;
}

/**
 * Inherit the prototype methods from one funciton
 *
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   ParentClass.call(this, a, b, c);
 * }
 * netric.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a parent class' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.parentClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
netric.inherits = function(childCtor, parentCtor) 
{
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.parentClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
}

/**
 * Used to manage dependencies at compile time or run-time if a callback is specified
 *
 * @param {string|string[]} mDeps Mixeed, can be a string or array of strings indicating required namespaces
 * @param {function} opt_methodName Optional callback function to be called once all dependencies are loaded
 */
 netric.require = function(mDeps, opt_methodName)
 {
  // TODO: currently a stub for the compiler
 }


/**
  * Declare a namespace
  *
  * @param {string} sName The full path of the namespace to provide
  */
netric.declare = function(sName) 
{
  netric.exportPath_(sName);
};

/**
 * Create object structure for a namespace path and make sure existing object are NOT overwritten
 *
 * @param {string} path oath of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default this
 * @private
 */
netric.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || window;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && opt_object) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};

/**
 * Get an object by name if it exists
 *
 * @param {string} path oath of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default this
 */
netric.getObjectByName = function(name, opt_object, opt_objectToExportTo) {
    var parts = name.split('.');
    var cur = opt_objectToExportTo || window;

    // Internet Explorer exhibits strange behavior when throwing errors from
    // methods externed in this manner.
    if (!(parts[0] in cur) && cur.execScript) {
        cur.execScript('var ' + parts[0]);
    }

    // Parentheses added to eliminate strict JS warning in Firefox.
    for (var part; parts.length && (part = parts.shift());) {
        if (!parts.length && opt_object) {
            // last part and we have an object; use it
            cur[part] = opt_object;
        } else if (cur[part]) {
            cur = cur[part];
        } else {
            // Object does not exist and/or is not loaded
            return null;
        }
    }

    // Looks like our object exists, return it now
    return cur;
};

module.exports = netric;