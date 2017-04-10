/**
 * @fileOverview Events is just a wrapper to alib.events
 *
 * @author:	Sky Stebnicki, sky.stebnicki@aereus.com;
 * 			Copyright (c) 2013 Aereus Corporation. All rights reserved.
 */

/**
 * Create events namespace
 *
 * @object
 */
var events = {
  /**
   * Only fire an event once, then stop listening for the event
   *
   * @param {element} el
   * @param {string} type Name of the array
   * @param {function} callback Function to call when event triggers
   */
  once: function(el, type, callback) {
    let typeArray = type.split(' ');
    let recursiveFunction = (e) => {
      e.target.removeEventListener(e.type, recursiveFunction);
      return callback(e);
    };

    for (let i = typeArray.length - 1; i >= 0; i--) {
      this.on(el, typeArray[i], recursiveFunction);
    }
  },

  /**
   * Listen for an event of type to be triggered on an element
   *
   * @param {element} el
   * @param {string} type Name of the array
   * @param {function} callback Function to call when event triggers
   */
  on: function(el, type, callback) {
    if(el.addEventListener) {
      el.addEventListener(type, callback);
    } else {
      el.attachEvent('on' + type, function() {
        callback.call(el);
      });
    }
  },

  /**
   * Stop listening to an event
   *
   * @param {element} el
   * @param {string} type Name of the array
   * @param {function} callback Function to call when event triggers
   */
  off: function(el, type, callback) {
    if(el.removeEventListener) {
      el.removeEventListener(type, callback);
    } else {
      el.detachEvent('on' + type, callback);
    }
  }
};

/**
 * TODO: The below are legacy and should be replaced with the above
 * ====================================================================
 */

/**
 * Add event listener to an element
 *
 * @var {mixed} obj Either a DOM element or a custom Object to attache event to
 * @var {string} eventName The name of the event to listen for
 * @var {function|Object} callback Can be a function or an object with {context:(object reference), method:(string name)}
 * @var {Object} data Optional data to pass to event
 */
events.listen = function(obj, eventName, callBack, data)
{
    alib.events.listen(obj, eventName, callBack, data);
}

/**
 * Removes an event from the object
 */
events.unlisten = function(obj, eventName, callBack)
{
    alib.events.unlisten(obj, eventName, callBack);
}

/**
 * Stop an event from bubbling up the event DOM
 */
events.stop = function(evt)
{
}

/**
 * Manually trigger an event by name if event type is not an included DOM event (like a custom event)
 *
 * This will not be needed for DOM dispatched events so only use it when defining custom events.
 *
 * @var {mixed} obj The context of the event being fired
 * @var {string} eventName The name of the event being fired
 * @var {Object} data Optional data to be passed to the callback in event.data
 */
events.triggerEvent = function(obj, eventName, data)
{
    alib.events.triggerEvent(obj, eventName, data);
}

export default events;