import * as ActionTypes from 'netric/actions/browserView';
import browserViewReducer from 'netric/reducers/browserView';
import BrowserView from 'netric/models/entity/BrowserView';

describe("BrowserView reducer", function () {
  let browserView = new BrowserView("customer");
  browserView.id = 1;
  browserView.name = "test browser view";

  const originalState = {};

  it("can save a browser view", function () {
    const expectedObj = {
        "customer": {
          views: [browserView.getData()],
          default_view: null
        }
    };
    const action = {
      type: ActionTypes.BROWSER_VIEW_UPDATE,
      objType: "customer",
      viewId: "1",
      browserViewData: browserView.getData()
    };

    expect(browserViewReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can update the browser view list", function () {
    const expectedObj = {
        "customer": {
          views: [browserView.getData(), browserView.getData(), browserView.getData()],
          default_view: null
        }
    };

    const action = {
      type: ActionTypes.BROWSER_VIEW_UPDATE_LIST,
      objType: "customer",
      browserViewDataList: [browserView.getData(), browserView.getData(), browserView.getData()]
    };

    expect(browserViewReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can update set default browser view", function () {
    const expectedObj = {
      "customer": {
        views: [],
        default_view: 1
      }
    };

    const action = {
      type: ActionTypes.BROWSER_VIEW_SET_DEFAULT,
      objType: "customer",
      defaultViewId: 1
    };

    expect(browserViewReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can update the current browser view", function () {
    const expectedObj = {
      "customer": {
        views: [],
        default_view: null,
        currentViewData: browserView.getData()
      }
    };

    const action = {
      type: ActionTypes.BROWSER_VIEW_CURRENT,
      objType: "customer",
      currentBrowserViewData: browserView.getData()
    };

    expect(browserViewReducer(originalState, action)).toEqual(expectedObj);
  });
});
