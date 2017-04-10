import * as ActionTypes from 'netric/actions/entity';
import {updateEntity, entityFetching, deleteEntity, updateEntityDeleted, updateAllEntityDefinitions, fetchAllEntityDefinitions} from 'netric/actions/entity';
import server from 'netric/server';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';

// Setup mock store
const mockStore = configureMockStore([thunk]);

describe("Entity Pure Actions", function () {
  it("should return an expected action when we call updateEntity", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_UPDATE,
      objType: "customer",
      id: 123,
      data: {notes: "test"}
    };
    expect(updateEntity(expectedObj.objType, expectedObj.id, expectedObj.data)).toEqual(expectedObj);
  });

  it("should return an expected action when we call entityFetching", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_FETCHING,
      objType: "customer",
      id: 123,
      isFetching: true
    };
    expect(entityFetching(expectedObj.objType, expectedObj.id, expectedObj.isFetching)).toEqual(expectedObj);
  });

  it("should return an expected action when we call deletedEntity", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_DELETED,
      objType: "customer",
      id: 123,
    };
    expect(updateEntityDeleted(expectedObj.objType, expectedObj.id)).toEqual(expectedObj);
  });

  it("should return entity definition of all object types", function () {
    const expectedObj = {
      type: ActionTypes.ENTITY_DEFINITION_UPDATE_ALL,
      entityDefinitionAllObjTypes: [
        {
          id: 1,
          obj_type: "customer"
        },
        {
          id: 2,
          obj_type: "notes"
        }
      ]
    };
    expect(updateAllEntityDefinitions(expectedObj.entityDefinitionAllObjTypes)).toEqual(expectedObj);
  });
});

describe("Entity Thunk actions", () => {

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
      mockState.account.server + '/svr/entity/remove',
      deleteEntities
    );

    fetchMock.mock(
      mockState.account.server + '/svr/entity/allDefinitions',
      entityDefinitions
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("deleteEntity() should update entities", (done) => {
    // Actions that should be triggered
    const expectedActions = [
      // Should update and then delete for each entity
      {type: ActionTypes.ENTITY_UPDATE, objType: objType, id: deleteEntities[0], data: {f_deleted: true}},
      {type: ActionTypes.ENTITY_DELETED, objType: objType, id: deleteEntities[0]},
      {type: ActionTypes.ENTITY_UPDATE, objType: objType, id: deleteEntities[1], data: {f_deleted: true}},
      {type: ActionTypes.ENTITY_DELETED, objType: objType, id: deleteEntities[1]}
    ];
    let store = mockStore(mockState);

    store.dispatch(deleteEntity(objType, deleteEntities))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it("fetchAllEntityDefinitions() should update entity definition of all object types", (done) => {
    // Actions that should be triggered
    const expectedActions = [
      {type: ActionTypes.ENTITY_DEFINITION_FETCHING_ALL, isEntityDefinitionAllObjTypesFetching: true},
      {type: ActionTypes.ENTITY_DEFINITION_UPDATE_ALL, entityDefinitionAllObjTypes: entityDefinitions},
      {type: ActionTypes.ENTITY_DEFINITION_FETCHING_ALL, isEntityDefinitionAllObjTypesFetching: false}
    ];
    let store = mockStore(mockState);

    store.dispatch(fetchAllEntityDefinitions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});
