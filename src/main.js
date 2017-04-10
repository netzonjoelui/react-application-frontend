/**
 * This is the main library file used to build and pack netric
 */
import 'babel-polyfill';

// Build netric object to export
let netric = require("./base");
netric.Device = require("./Device");
netric.Application = require("./Application");

export default netric;
