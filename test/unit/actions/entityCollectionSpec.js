import * as ActionTypes from 'netric/actions/entityCollection';
import {fetchEntityCollection, fetchNotifications, updateNotification,
  updateEntityCollection, setEntityCollectionDirty, setCollectionLoading} from 'netric/actions/entityCollection';
import server from 'netric/server';
import Collection from 'netric/models/entity/Collection';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';

// Setup mock store
const mockStore = configureMockStore([thunk]);

// Constants used in fetching entities
const userId = "1";
const collectionId = "notifications";
const collectionResultsData = {
  total_num: "1",
  entities: [{
    obj_type: "notification",
    id: userId,
    name: "Update Note"
  }]
};

let collection = new Collection("notification");

collection.andWhere("owner_id").value = userId;
collection.setOrderBy("ts_entered", "desc");
collection.andWhere("f_shown").value = false;
collection.andWhere("f_seen").value = false;
collection.setLimit(5);

describe("Entity Collection Pure Actions", function () {
  it("should return an expected action when we call fetchNotifications", function () {
    const expectedObj = {
      type: ActionTypes.NOTIFICATION_UPDATE,
      collectionId: collectionId,
      query: collection.queryToData(),
      results: collectionResultsData
    };
    expect(updateNotification(collectionId, collection.queryToData(), collectionResultsData)).toEqual(expectedObj);
  });

  it("should return an expected action when we call updateEntityCollection", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_COLLECTION_UPDATE,
      collectionId: collectionId,
      query: collection.queryToData(),
      results: collectionResultsData
    };
    expect(updateEntityCollection(collectionId, collection.queryToData(), collectionResultsData)).toEqual(expectedObj);
  });

  it("should return an expected action when we call setEntityCollectionDirty", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_COLLECTION_MARK_DIRTY,
      collectionId: collectionId
    };
    expect(setEntityCollectionDirty(collectionId)).toEqual(expectedObj);
  });

  it("should return an expected action when we call setCollectionLoading", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_COLLECTION_LOADING,
      collectionId: collectionId,
      isLoading: true
    };
    expect(setCollectionLoading(collectionId, true)).toEqual(expectedObj);
  });
});

describe("Entity Collection Thunk actions", () => {

  const deleteEntities = [12, 21];
  const objType = "test_type";
  const entityDefinitions = [
    {
      id: 1,
      obj_type: "customer"
    },
    {
      id: 2,
      obj_type: "notes"
    }
  ];

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
    server.universalLoginUri = 'mock://mockhost';

    // Mock out endpoint for user authentication
    fetchMock.mock(
      mockState.account.server + '/svr/entity-query/execute',
      collectionResultsData
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("fetchNotifications() should return the notifications data", (done) => {

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.NOTIFICATION_UPDATE,
        collectionId: collectionId,
        query: collection.queryToData(),
        results: collectionResultsData
      }
    ];
    let store = mockStore(mockState);

    store.dispatch(fetchNotifications(collectionId, userId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it("fetchEntityCollection() should return the entity data", (done) => {

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.ENTITY_COLLECTION_LOADING,
        collectionId: collectionId,
        isLoading: true
      },
      {
        type: ActionTypes.ENTITY_COLLECTION_UPDATE,
        collectionId: collectionId,
        query: collection.queryToData(),
        results: collectionResultsData
      },
      {
        type: ActionTypes.ENTITY_COLLECTION_LOADING,
        collectionId: collectionId,
        isLoading: false
      }
    ];
    let store = mockStore(mockState);

    store.dispatch(fetchEntityCollection(collection, collectionId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});
