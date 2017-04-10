import * as ActionTypes from 'netric/actions';
import entityReducer from 'netric/reducers/entity';
import Collection from 'netric/models/entity/Collection';

// Constants used in fetching entities
const userId = "1";
const testExecutedTime = (new Date()).getTime();
const entityData = {
  obj_type: "notification",
  id: userId,
  name: "Update Note"
};
const collectionId = "notifications";
const collectionResultsData = {
  total_num: "1",
  entities: []
};

let collection = new Collection("notification");

collection.andWhere("owner_id").value = userId;
collection.setOrderBy("ts_entered", "desc");
collection.andWhere("f_shown").value = false;
collection.andWhere("f_seen").value = false;
collection.setLimit(5);
describe("Entity reducer", function () {

  const originalState = {
    entities: {},
    definitions: {},
    collections: {}
  };

  let expectedObj = {
    entities: {},
    definitions: {},
    collections: {}
  };

  it("can update an entity", function () {

    // Set the expected object to have the entity data of notification objtype with id 1
    expectedObj.entities["notification-1"] = entityData

    const action = {
      type: ActionTypes.ENTITY_UPDATE,
      objType: "notification",
      id: 1,
      data: entityData
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can update an entity definition", function () {

    // Set the expected object to have the notification objtype definition
    expectedObj.definitions.notification = {
      id: 1,
      title: "notifications",
      objType: "notification",
      lastFetchedTime: testExecutedTime,
      lastFetched: testExecutedTime
    }

    const action = {
      type: ActionTypes.ENTITY_DEFINITION_UPDATE,
      objType: "notification",
      data: {
        id: 1,
        title: "notifications",
        objType: "notification",
        lastFetchedTime: testExecutedTime
      }
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can update an entity collection and can also update a specific entity collection like notification", function () {

    // Set the expected object to have the collections with the constant collectionId as index
    expectedObj.collections[collectionId] = {
      isDirty: false,
      query: collection.queryToData(),
      results: collectionResultsData,
      lastUpdated: testExecutedTime
    }

    const action = {
      type: ActionTypes.ENTITY_COLLECTION_UPDATE,
      collectionId: collectionId,
      query: collection.queryToData(),
      results: collectionResultsData,
      lastUpdatedTime: testExecutedTime
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can mark a collection as dirty", function () {

    // Update the expectedObject.collection collectionId as dirty
    expectedObj.collections[collectionId].isDirty = true;

    const action = {
      type: ActionTypes.ENTITY_COLLECTION_MARK_DIRTY,
      collectionId: collectionId
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can set a flag that the collection is still loading", function () {

    // Update the expectedObject.collection collectionId that it is loading
    expectedObj.collections[collectionId].isLoading = true;

    const action = {
      type: ActionTypes.ENTITY_COLLECTION_LOADING,
      collectionId: collectionId,
      isLoading: true
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can add entity definition of all object types", function () {

    // Add the project objtype definition in the expectedObj.definitions
    expectedObj.definitions.project = {
      id: 1,
      obj_type: "project",
      lastFetchedTime: testExecutedTime,
      lastFetched: testExecutedTime
    };

    // Add the notes objtype definition in the expectedObj.definitions
    expectedObj.definitions.notes = {
      id: 2,
      obj_type: "notes",
      lastFetchedTime: testExecutedTime,
      lastFetched: testExecutedTime
    };

    const action = {
      type: ActionTypes.ENTITY_DEFINITION_UPDATE_ALL,
      entityDefinitionAllObjTypes: [
        {
          id: 1,
          obj_type: "project",
          lastFetchedTime: testExecutedTime
        },
        {
          id: 2,
          obj_type: "notes",
          lastFetchedTime: testExecutedTime
        }
      ]
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can set a flag that all the entity definitions are being fetched", function () {

    // Update the expectedObj.definitions.isEntityDefinitionAllObjTypesFetching that it is being fetched
    expectedObj.definitions.isEntityDefinitionAllObjTypesFetching = true;

    const action = {
      type: ActionTypes.ENTITY_DEFINITION_FETCHING_ALL,
      isEntityDefinitionAllObjTypesFetching: true
    };

    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });
});
