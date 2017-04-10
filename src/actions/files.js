import fetch from 'isomorphic-fetch'

/**
 * Action type constants
 *
 * @type {string}
 */
export const FILES_UPLOADED = 'FILES_UPLOADED';

/**
 * Update the uploaded file list with the result from uploading of files
 *
 * @param {Object} data The data of the files that were uploaded to the server
 * @param {string} processId Unique Id string that was used when processing the uploading of files
 * @returns {{type: string, data: {}, processId: int}}
 */
export const filesUploaded = (data, processId) => {
  return {
    type: FILES_UPLOADED,
    data,
    processId
  };
};

/**
 * Upload a file to the server
 *
 * @param {object} fileList Contains the list of files selected with the <input type="file"> element
 * @param {string} uploadingProcessId Unique Id string that is used to identity the uploading process
 * @param {int} folderId This will determine where to upload the files.
 * @param {string} folderPath The path of the folder where we will upload the file
 * @returns {Function}
 */
export function uploadFiles(fileList, uploadingProcessId, folderId, folderPath) {
  return function (dispatch, getState) {
    const state = getState();
    const serverHost = state.account.server;
    const sessionToken = state.account.user.authToken;

    // Set the formData to be posted to the server
    let formData = new FormData();

    if (folderId) {
      formData.append('folderid', folderId);
    }

    if (folderPath) {
      formData.append('path', escape(folderPath));
    }

    // Loop thru the fileList object and get the files to be uploaded to the server
    for (let idx in fileList) {

      /*
       * The File interface provides information about files.
       * A File object is a specific kind of a Blob, and can be used in any context that a Blob can.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/File
       */
      const file = fileList[idx];

      // Make sure the the current file is a blob before appending it to the FormData
      if (file instanceof Blob) {
        formData.append('files[]', file, file.name);
      }
    }

    return fetch(`${serverHost}/svr/files/upload`, {
      method: 'POST',
      headers: {
        'Authentication': sessionToken
      },
      body: formData
    }).then(response => response.json()).then((data) => {

      // Update the file list
      dispatch(filesUploaded(data, uploadingProcessId));
    }).catch((error) => {
      // TODO: We should probably dispatch another action for the error
      console.error('request failed', error)
    });
  }
}

