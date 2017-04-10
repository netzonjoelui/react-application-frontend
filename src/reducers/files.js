import * as ActionTypes from '../actions/files';

/**
 * Define the default structure of our state
 */
const initialState = {
  uploadedFiles: {}
};

/**
 * Handle file list transformation
 */
const files = (state = initialState, action) => {

  switch (action.type) {
    case ActionTypes.FILES_UPLOADED:

      let newState = Object.assign({}, state);

      // Make sure we have uploadedFiles state
      if (!newState.uploadedFiles.hasOwnProperty("uploadedFiles")) {
        newState.uploadedFiles = {}
      }

      try {

        // action.processId should be unique
        if (!newState.uploadedFiles.hasOwnProperty(action.processId)) {

          // Set the action data to the processId index in uploadedFiles state
          newState.uploadedFiles[action.processId] = action.data

        } else {

          /*
           * If there is already action.processId set, then we should throw an error
           * Since we do not want to overwrite the existing processId state
           */
          console.error("Problem reducing file uploads", "Process Id already exists.");
        }
      } catch (e) {
        console.error("Problem reducing file uploads", e);
      }

      return newState;
      break;
  }

  return state;
};

export default files;
