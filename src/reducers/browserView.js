import {
  BROWSER_VIEW_CURRENT,
  BROWSER_VIEW_UPDATE,
  BROWSER_VIEW_SET_DEFAULT,
  BROWSER_VIEW_UPDATE_LIST
} from '../actions/browserView';

/**
 * Define the default structure of our state
 */
const initialState = {};

/**
 * Handle browserView transformation
 */
const browserView = (state = initialState, action) => {

  let newState = Object.assign({}, state);
  let newAction = Object.assign({}, action);

  // If we do not have an browser view state for action.objType, then we need to create one
  if (!newState.hasOwnProperty(action.objType)) {
    newState[action.objType] = {
      views: [],
      default_view: null
    };
  }

  switch (action.type) {
    case BROWSER_VIEW_UPDATE_LIST:

      // Update the browser view list for action.objType
      newState[action.objType].views = newAction.browserViewDataList;

      return newState;
      break;

    case BROWSER_VIEW_UPDATE:
      // Set the updated browser view

      let viewList = newState[action.objType].views;
      let viewIndex = null;

      for (let idx in viewList) {

        if (viewList[idx].id === newAction.viewId) {
          viewIndex = idx;
          break;
        }
      }

      /*
       * If we have found the viewIndex, then we will overwrite it with the updated browserViewData
       * Otherwise, we will just push the new browserViewData in the viewList
       */
      if (viewIndex) {
        viewList[viewIndex] = newAction.browserViewData;
      } else {
        viewList.push(newAction.browserViewData);
      }

      return newState;
      break;

    case BROWSER_VIEW_SET_DEFAULT:
      // Set the default browser view

      newState[action.objType].default_view = newAction.defaultViewId;

      if (newState[action.objType].views) {
        newState[action.objType].views.forEach((viewData) => {

          // Let's set the current view data based on the default view id provided
          if (viewData.id == newAction.defaultViewId) {
            newState[action.objType].currentViewData = viewData;
            return;
          }
        })
      }

      return newState;
      break;

    case BROWSER_VIEW_CURRENT:
      // Set the current browser view
      newState[action.objType].currentViewData = newAction.currentBrowserViewData;

      return newState;
      break;
  }

  return state;
};

export default browserView;
