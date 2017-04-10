import * as ActionTypes from '../actions/groupings';

/**
 * Define the default structure of our state
 */
const initialState = {};

/**
 * Handle groupings transformation
 */
const groupings = (state = initialState, action) => {

  switch (action.type) {
    case ActionTypes.GROUPINGS_UPDATE:

      let newState = Object.assign({}, state);

      // If we do not have a groupings state for action.objType, then we need to create one
      if (!newState.hasOwnProperty(action.objType)) {
        newState[action.objType] = {}
      }

      // Update the groupings for action.objType
      newState[action.objType][action.fieldName] = Object.assign({}, action.groupingsData);

      return newState;
      break;
  }

  return state;
};

export default groupings;
