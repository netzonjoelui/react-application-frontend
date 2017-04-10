/**
 * @fileOverview Define the objects fields of file
 *
 * This class is a client side mirror of /lib/EntityDefinition/File on the server side
 *
 * @author:    Marl Tumulak, marl.tumulak@aereus.com;
 *            Copyright (c) 2015 Aereus Corporation. All rights reserved.
 */
import netric from '../../../base';

/**
 * Creates an instance of File
 *
 * @param {entity/Entity} entity The entity definition of the file object
 * @constructor
 */
var File = function (opt_data) {

  var data = opt_data || {};

  /**
   * The id of the file
   *
   * data.key is sometimes used to get the id of file when constructing this from a grouping field rather than entity data.
   *
   * @public
   * @type {int}
   */
  this.id = data.id || data.key || null;

  /**
   * The name of the file
   *
   * data.value is sometimes used to get the name of file when constructing from a grouping field rather than entity data.
   *
   * @public
   * @type {string}
   */
  this.name = data.name || data.value || null;

  /**
   * The filetype of the file
   *
   * @public
   * @type {string}
   */
  this.filetype = data.filetype || null;

  /**
   * Progress data that is used when uploading a file
   *
   * @public
   * @type {object}
   */
  this.progress = {
    uploaded: 0,
    total: 0,
    progressCompleted: 0,
    errorText: null,
  }
}

/**
 * Return an object representing the actual values of this file
 *
 * @return {}
 */
File.prototype.getData = function() {

  return {
    id: this.id,
    name: this.name,
    filetype: this.filetype,
    hash: this.hash
  }
};

/**
 * Gets the url of the file
 *
 * @return {string}
 * @public
 */
File.prototype.getFileUrl = function () {
    var fileUrl = null;

    if (this.id) {
        fileUrl = netric.server.host + '/files/' + this.id
    }

    return fileUrl;
}

/**
 * Check if the file is an image
 *
 * @return {string}
 * @public
 */
File.prototype.isImage = function () {
    var result = false;

    // Check if file is an image via file name extension
    if (this.name && this.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
        result = true;
    }

    return result;
}

/**
 * Get file type (extension)
 *
 * @returns {string}
 */
File.prototype.getType = function() {

    if (this.filetype) {
        return this.filetype;
    }

    // Try to parse from the fiel 'name'
    if (!this.name) {
        return "";
    }

    // Parse the name to get the extension
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(this.name)[1];

    if (ext) {
        return ext;
    } else {
        return "";
    }
};

/**
 * Get the best icon class name for this file type
 *
 * @public
 * @return string
 */
File.prototype.getIconClassName = function () {

    // Font-awesome prefix
    var iconPre = "fa ";

    switch (this.getType().toLowerCase()) {
        case 'doc':
        case 'docx':
            return iconPre + "fa-file-word-o";
        case 'xls':
        case 'xlsx':
            return iconPre + "fa-file-excel-o";
        case 'pdf':
            return iconPre + "fa-file-pdf-o";
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return iconPre + "fa-pdf-o";

    }

    // return default
    return "fa fa-file-o";
};

module.exports = File;