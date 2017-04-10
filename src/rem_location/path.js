/**
* @fileOverview Utilities for dealing with a path
*
* @author:  Sky Stebnicki, sky.stebnicki@aereus.com; 
*       Copyright (c) 2015 Aereus Corporation. All rights reserved.
*/
'use strict';

/** 
 * Create path namespace for path utility funtions
 */
var locationPath = {};

/**
 * Setup patterns
 */
locationPath.patterns = {
  paramCompileMatcher: /:([a-zA-Z_$][a-zA-Z0-9_$]*)|[*.()\[\]\\+|{}^$]/g,
  paramInjectMatcher:  /:([a-zA-Z_$][a-zA-Z0-9_$?]*[?]?)|[*]/g,
  paramInjectTrailingSlashMatcher: /\/\/\?|\/\?/g,
  queryMatcher: /\?(.+)/
}

/**
 * Cache compiled patterns
 *
 * @private
 * @type {Object}
 */
locationPath.compiledPatterns_ = {};

/**
 * Safely decodes special characters in the given URL path.
 */
locationPath.decode = function (path) {
  return decodeURI(path.replace(/\+/g, ' '));
}

/**
 * Safely encodes special characters in the given URL path.
 */
locationPath.encode = function (path) {
  return encodeURI(path).replace(/%20/g, '+');
}

/**
 * Compile a pattern and cache it so we don't do a RegExp evey single route change
 *
 * @private
 * @param {string} pattern The pattern to look for in the given path
 */
locationPath.compilePattern_ = function(pattern) {

  if (!(pattern in this.compiledPatterns_)) {
    var paramNames = [];
    var source = pattern.replace(this.patterns.paramCompileMatcher, function (match, paramName) {
      if (paramName) {
        paramNames.push(paramName);
        return '([^/?#]+)';
      } else if (match === '*') {
        paramNames.push('splat');
        return '(.*?)';
      } else {
        return '\\' + match;
      }
    });

    this.compiledPatterns_[pattern] = {
      matcher: new RegExp('^' + source + '$', 'i'),
      paramNames: paramNames
    };
  }

  return this.compiledPatterns_[pattern];
}

/**
 * Returns an array of the names of all parameters in the given pattern.
 *
 * @public
 * @param {string} pattern The pattern to look for in the given path
 * @returns {Object} Object with a .matcher RegExp and a .paramNames array
 */
locationPath.extractParamNames = function(pattern) {
  return this.compilePattern_(pattern).paramNames;
}

/**
   * Extracts the portions of the given URL path that match the given pattern
   * and returns an object of param name => value pairs. Returns null if the
   * pattern does not match the given path.
   */
locationPath.extractParams = function(pattern, path) {

  var object = this.compilePattern_(pattern);
  var match = path.match(object.matcher);

  if (!match)
    return null;

  var params = {};

  object.paramNames.forEach(function(paramName, index) {
    params[paramName] = match[index + 1];
  });

  return params;
}

/**
 * Returns a version of the given route path with params interpolated. Throws
 * if there is a dynamic segment of the route path for which there is no param.
 */
locationPath.injectParams = function(pattern, params) {
  params = params || {};

  var splatIndex = 0;
  

  return pattern.replace(this.patterns.paramInjectMatcher, function(match, paramName) {
    paramName = paramName || 'splat';

    // If param is optional don't check for existence
    if (paramName.slice(-1) !== '?') {
      if (params[paramName] == null) {
        throw 'Missing "' + paramName + '" parameter for path "' + pattern + '"';  
      }
      
    } else {
      paramName = paramName.slice(0, -1);

      if (params[paramName] == null)
        return '';
    }

    var segment;
    if (paramName === 'splat' && Array.isArray(params[paramName])) {
      segment = params[paramName][splatIndex++];

      if (segment == null) {
        throw 'Missing splat #' + splatIndex + ' for path "' + pattern + '"';  
      }
      
    } else {
      segment = params[paramName];
    }

    return segment;
  }).replace(locationPath.patterns.paramInjectTrailingSlashMatcher, '/');
}

/**
 * Returns an object that is the result of parsing any query string contained
 * in the given path, null if the path contains no query string.
 */
locationPath.extractQuery = function(path) {
  var match = path.match(this.patterns.queryMatcher);
  return match && this.parseQuery(match[1]);
}

/**
 * Returns a version of the given path without the query string.
 */
locationPath.withoutQuery = function(path) {
  return path.replace(this.patterns.queryMatcher, '');
}

/**
 * Returns true if the given path is absolute.
 */
locationPath.isAbsolute = function(path) {
  return path.charAt(0) === '/';
}

/**
 * Returns a normalized version of the given path.
 */
locationPath.normalize = function(path, parentRoute) {
  return path.replace(/^\/*/, '/');
}

/**
 * Joins two URL paths together.
 */
locationPath.join = function(a, b) {
  return a.replace(/\/*$/, '/') + b;
}

/**
 * Returns a version of the given path with the parameters in the given
 * query merged into the query string.
 */
locationPath.withQuery = function(path, query) {
  var existingQuery = this.extractQuery(path);

  // Merge query objects
  if (existingQuery)
  {
    var merged = {};
    for (var attrname in existingQuery) { merged[attrname] = existingQuery[attrname]; }
    for (var attrname in query) { merged[attrname] = query[attrname]; }
    query = merged;
  }

  //var queryString = query && qs.stringify(query);
  var queryString = this.stringifyQuery(query);

  if (queryString)
    return this.withoutQuery(path) + '?' + queryString;

  return path;
}

/**
 * Convert an object into a query string
 *
 * @param {Object} queryObj An objet with key values
 * @return {string} A string representation of the object
 */
locationPath.stringifyQuery = function(queryObj) {
  return queryObj ? Object.keys(queryObj).map(function (key) {
      var val = queryObj[key];

      if (Array.isArray(val)) {
        return val.map(function (val2) {
          return encodeURIComponent(key + "[]") + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}

/**
 * Parse a query string and return an object
 * 
 * @param {string} str The query string to parse
 * @return {} Key value for each query string param
 */
locationPath.parseQuery = function (str) {
  if (typeof str !== 'string') {
    return {};
  }

  str = str.trim().replace(/^(\?|#)/, '');

  if (!str) {
    return {};
  }

  return str.trim().split('&').reduce(function (ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts[0];
    var val = parts[1];

    key = decodeURIComponent(key);

    // If key is an array it will be postfixed with [] which should be removed
    key = key.replace("[]", "");

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }

    return ret;
  }, {});
};

module.exports = locationPath;

