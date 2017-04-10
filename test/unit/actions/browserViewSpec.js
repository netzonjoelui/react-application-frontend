import * as ActionTypes from 'netric/actions/browserView';
import {updateCurrentBrowserView, updateBrowserViewList, updateBrowserView, saveBrowserView, setDefaultBrowserView} from 'netric/actions/browserView';
import BrowserView from 'netric/models/entity/BrowserView';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';

// Setup mock store
const mockStore = configureMockStore([thunk]);

describe("Pure Actions", function () {
  it("should return an expected action when we call updateBrowserView", function () {

    let browserView = new BrowserView("customer");

    const expectedObj = {
      type: ActionTypes.BROWSER_VIEW_UPDATE,
      viewId: 1,
      objType: browserView.objType,
      browserViewData: browserView.getData()
    };
    expect(updateBrowserView(expectedObj.viewId, browserView.objType, browserView.getData())).toEqual(expectedObj);
  });

  it("should return an expected action when we call updateBrowserViewList", function () {

    let browserView = new BrowserView("customer");
    let browserViewDataList = [browserView.getData(), browserView.getData(), browserView.getData()];

    const expectedObj = {
      type: ActionTypes.BROWSER_VIEW_UPDATE_LIST,
      objType: browserView.objType,
      browserViewDataList: browserViewDataList
    };
    expect(updateBrowserViewList(browserView.objType, browserViewDataList)).toEqual(expectedObj);
  });

  it("should return an expected action when we call updateCurrentBrowserView", function () {

    let browserView = new BrowserView("customer");

    const expectedObj = {
      type: ActionTypes.BROWSER_VIEW_CURRENT,
      objType: browserView.objType,
      currentBrowserViewData: browserView.getData()
    };
    expect(updateCurrentBrowserView(browserView.objType, browserView.getData())).toEqual(expectedObj);
  });
});

describe("BrowserView fetch async actions", () => {

  const objType = "customer";
  let browserView = new BrowserView(objType);
  let saveViewId = 2;
  let defaultViewId = 3;

  const mockState = {
    account: {
      server: 'mock://mockhost',
      user: {
        authToken: 'auth1234'
      }
    }
  };

  /*
   * Setup each test
   */
  beforeEach(() => {

    // Mock out endpoint for user authentication
    fetchMock.mock(
      mockState.account.server + '/svr/browserView/save',
      saveViewId.toString()
    );

    // Mock out endpoint for setting a default browser view
    fetchMock.mock(
      mockState.account.server + '/svr/browserView/setDefaultView',
      defaultViewId.toString()
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("saveBrowserView() should save the customer browser view", (done) => {

    let store = mockStore(mockState);
    browserView.id = saveViewId;

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.BROWSER_VIEW_UPDATE,
        objType: objType,
        viewId: saveViewId,
        browserViewData: browserView.getData()
      }
    ];

    store.dispatch(saveBrowserView(browserView))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it("setDefaultBrowserView() can set view as the default browser view", (done) => {

    let store = mockStore(mockState);
    browserView.id = defaultViewId;

    // Actions that should be triggered
    const expectedActions = [
      {type: ActionTypes.BROWSER_VIEW_SET_DEFAULT, objType: objType, defaultViewId: defaultViewId}
    ];

    store.dispatch(setDefaultBrowserView(browserView))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});