/**
 * @fileoverview File Upload
 *
 * Manages the file uploading to the server.
 */
'use strict';

import React from 'react';
var ReactDOM = require("react-dom");
var netric = require("../base");
var controller = require("./controller");
var AbstractController = require("./AbstractController");
var UiFileUpload = require("../ui/fileupload/FileUpload.jsx");
var fileUploader = require("../entity/fileUploader");
var entitySaver = require("../entity/saver");
var File = require("../entity/fileupload/File");

/**
 * Controller that loads a File Upload Component
 */
var FileUploadController = function () {
}

/**
 * Extend base controller class
 */
netric.inherits(FileUploadController, AbstractController);

/**
 * Handle to root ReactElement where the UI is rendered
 *
 * @private
 * @type {ReactElement}
 */
FileUploadController.prototype._rootReactNode = null;

/**
 * The files that are already uploded
 * Should contain the collection of File instances (entity/definition/File)
 *
 * @private
 * @type {Array}
 */
FileUploadController.prototype._uploadedFiles = [];

/**
 * The name of the object type we are working with
 *
 * @public
 * @type {string}
 */
FileUploadController.prototype.objType = 'file';

/**
 * Flag that will determine if we have an error uploading the files
 *
 * @private
 * @type {bool}
 */
FileUploadController.prototype._fileUploadError = false;

/**
 * Function called when controller is first loaded but before the dom ready to render
 *
 * @param {function} opt_callback If set call this function when we are finished loading
 */
FileUploadController.prototype.onLoad = function (opt_callback) {

    var callbackWhenLoaded = opt_callback || null;

    // Clear the upload files before rendering
    this._uploadedFiles = [];

    if (callbackWhenLoaded) {
        callbackWhenLoaded();
    } else {
        this.render();
    }
}

/**
 * Render this controller into the dom tree
 */
FileUploadController.prototype.render = function () {

    // Set outer application container
    var domCon = this.domNode_;

    // Unhide toolbars if we are in a page mode
    var hideToolbar = this.props.hideToolbar || true;
    if (this.getType() === controller.types.PAGE) {
        hideToolbar = false;
    }

    // Define the data
    var data = {
        title: this.props.title || "Add Attachment",
        currentPath: this.props.currentPath,
        folderId: this.props.folderId,
        uploadedFiles: this._uploadedFiles,
        hideToolbar: hideToolbar,
        multipleSelect: this.props.multipleSelect,
        buttonLabel: this.props.buttonLabel,
        iconClassName: this.props.iconClassName,
        onNavBtnClick: function (evt) {
            this.close();
        }.bind(this),
        onUpload: function (file, index, folder) {
            this._handleUploadFile(file, index, folder)
        }.bind(this),
        onRemove: function (index) {
            this._handleRemoveFile(index)
        }.bind(this),
        getFileUrl: function (index) {
            this._getFileUrl(index)
        }.bind(this)
    }

    // Render browser component
    this._rootReactNode = ReactDOM.render(
        React.createElement(UiFileUpload, data),
        domCon
    );
}

/**
 * Handles the uploading of files.
 *
 * @param {array} queuedFiles      Collection of files to be uploaded
 * @param {int} index              Index of the current file to be uploaded
 * @param {object} folder          Data of the folder to be used to save the files
 *
 * @private
 */
FileUploadController.prototype._handleUploadFile = function (queuedFiles, index, folder) {

    // Check if the index is existing in the files collection
    if (queuedFiles[index]) {

        // Get the File Instance
        var fileIndex = this._uploadedFiles.length;
        var fileName = queuedFiles[index].name;

        // Set the formData to be posted in the server
        var formData = new FormData();
        formData.append('files[]', queuedFiles[index], fileName);

        if (folder.id) {
            formData.append('folderid', folder.id);
        }

        if (folder.path) {
            formData.append('path', escape(folder.path));
        }

        // Create a new instance of the file object with the file entity defined
        var file = new File();
        file.name = fileName;

        // Add the file in the uploadedFiles[] array
        this._uploadedFiles[fileIndex] = file;
        this.render();

        // Re render the fileupload and display the progress of the upload
        var funcProgress = function (evt) {
            this._uploadedFiles[fileIndex].progress = evt.data;
            this.render();
        }.bind(this);

        // Re render the fileUpload with the result of the uploaded files
        var funcCompleted = function (result) {
            this._uploadedFiles[fileIndex].id = result[0].id;
            this.render();

            // If callback is set, then lets pass the file id and file name
            if (this.props.onFilesUploaded) {
                this.props.onFilesUploaded(file);
            }

            // Continue to the next upload file if there's any
            this._handleUploadFile(queuedFiles, index + 1, folder);
        }.bind(this);

        // Re render the fileupload and display the error
        var funcError = function (evt) {

            // Notifiy this controller that we have an error uploading a file
            this._fileUploadError = true;

            this._uploadedFiles[fileIndex].progress.errorText = evt.errorText;
            this.render();

            // Continue to the next upload file if there's any
            this._handleUploadFile(queuedFiles, index + 1, folder);
        }.bind(this);

        // Upload the file to the server
        fileUploader.upload(formData, funcProgress, funcCompleted, funcError);
    } else {

        // Trigger when all files are finished uploading
        if (this.props.onQueueUploadFinished) {
            this.props.onQueueUploadFinished();
        }

        /**
         * Do not unload this controller if we have an error uploading a file
         * The error message will be displayed in fileuploader
         * And will let the user know what is the error
         */
        if (this._fileUploadError) {

            // Reset the flag to false
            this._fileUploadError = false;
        } else {

            // When all files are finished uploading, we will unload the fileupload component
            this.unload();
        }
    }
}

/**
 * Handles the deleting of files.
 *
 * @param {int} index      The index of the file to be deleted
 *
 * @private
 */
FileUploadController.prototype._handleRemoveFile = function (index) {

    var fileId = this._uploadedFiles[index].id;

    // Check if the file has id before we try to remove it from the entity
    if (fileId) {
        var funcCompleted = function (result) {
            this._uploadedFiles.splice(index, 1);

            // If callback is set, then lets pass file id
            if (this.props.onRemoveFilesUploaded) {
                this.props.onRemoveFilesUploaded(fileId, index);
            }

            this.render();
        }.bind(this);

        // Remove the file from the server
        entitySaver.remove(this.objType, fileId, funcCompleted);
    } else {
        this._uploadedFiles.splice(index, 1);
        this.render();
    }
}


module.exports = FileUploadController;

