import * as ActionTypes from '../actions';
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

// Import reducers
import device from './device';
import module from './module';
import entity from './entity';
import account from './account';
import browserView from './browserView';
import groupings from './groupings';
import files from './files';

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action;

  // Set any errors
  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }

  // Return default error messages
  return state
};

// Combine reducers to compose the state
const rootReducer = combineReducers({
  device,
  module,
  entity,
  account,
  browserView,
  groupings,
  files,
  errorMessage,
  router
});

export default rootReducer;
