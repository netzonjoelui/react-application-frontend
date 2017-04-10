import * as ActionTypes from '../actions/module';

const initialState = {
  selectedModule: null,
  defaultModule: null,
  isFetching: false,
  availableModules: [],
  modules: {}
};

/**
 * Handle device transformations
 */
const module = (state = initialState, action) => {

  // Set cached module
  if (action.type === ActionTypes.MODULE_UPDATE) {
    let newState = Object.assign({}, state);
    newState.modules[action.name] = action.data;
    return newState;
  }

  // Update fetching flag
  if (action.type === ActionTypes.MODULE_FETCHING) {
    return Object.assign({}, state, {
      isFetching: action.isFetching
    });
  }
  
  // Set available modules
  if (action.type === ActionTypes.MODULES_AVAILABLE_UPDATE) {
    return Object.assign({}, state, {
      availableModules: action.modules
    });
  }
  
  // Set the default module
  if (action.type === ActionTypes.MODULE_UPDATE_DEFAULT) {
    return Object.assign({}, state, {
      defaultModule: action.moduleName
    });
  }

  return state
};


export default module;
