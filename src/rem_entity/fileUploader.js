/**
 * @fileOverview File Uploader.
 * Uploads the files to the server
 * Removes the files from the server
 * Gets the file url link from the server
 *
 * @author:  Marl Tumulak, marl.tumulak@aereus.com;
 *           Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
'use strict';

var BackendRequest = require("../BackendRequest");
var events = require("../util/events")
var nertic = require("../base");
var log = require("../log");

var FileUploader = {
    /**
     * Uploads file to the server
     *
     * @param {FormData} data                   The form data to be saved. This will include the files to be uploaded
     * @param {function} progressCallback       Callback for progress bar
     * @param {function} opt_finishedCallback   Optional callback to call when saved
     * @param {function} opt_errorCallback      Optional callback to call when there is an error uploading the file
     * @public
     */
    upload: function(data, progressCallBack, opt_finishedCallback, opt_errorCallback) {

        if (!data) {
            throw "File data should be defined";
        }

        var errorText = "Error on uploading the file: There was a problem contacting the server";

        // If we are connected
        if (netric.server.online) {
            var request = new BackendRequest();

            // Success callback
            events.listen(request, "load", function(evt) {
                if(opt_finishedCallback) {
                    opt_finishedCallback(this.getResponse());
                }
            });

            // Error callback
            events.listen(request, "error", function(evt) {
                if(opt_errorCallback) {
                    evt.errorText = errorText;
                    opt_errorCallback(evt);
                }

                throw errorText;
            });

            // Progress callback
            events.listen(request, "progress", function(evt) {
                if(progressCallBack) {
                    progressCallBack(evt);
                }
            });

            // Save the data remotely
            request.setDataIsForm(true);
            request.send("/svr/files/upload", 'POST', data);

        } else {
            var error = {errorText: errorText}

            if(opt_errorCallback) {
                opt_errorCallback(error);
            }

            log.notice(error);
        }
    },
}

module.exports = FileUploader;