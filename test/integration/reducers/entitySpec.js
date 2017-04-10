import * as ActionTypes from 'netric/actions/entity';
import entityReducer from 'netric/reducers/entity';

describe("Entity reducer", function() {
  const originalState = {
    entities: {
      "customer-123" : {
        id: "123",
        name: "original name"
      }
    },
    definitions: {
      "customer": {
        default_view: "default"
      }
    }
  };

  it("should merge autonomous property changes", function () {
    const expectedObj = {
      entities: {
        'customer-123' : {
          id: "123",
          name: "updated name"
        }
      },
      definitions: {
        "customer": {
          default_view: "default"
        }
      }
    };
    const action = {
      type: ActionTypes.ENTITY_UPDATE,
      objType: "customer",
      id: "123",
      data: {name: "updated name"}
    };
    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("can clear a property", function () {
    const expectedObj = {
      entities: {
        "customer-123" : {
          id: "123",
          name: ""
        }
      },
      definitions: {
        "customer": {
          default_view: "default"
        }
      }
    };
    const action = {
      type: ActionTypes.ENTITY_UPDATE,
      objType: "customer",
      id: "123",
      data: {name: ""}
    };
    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("will reset an entire entity", function () {
    const expectedObj = {
      entities: {
        "customer-123" : {
          id: "321",
          name: "reset name"
        }
      },
      definitions: {
        "customer": {
          default_view: "default"
        }
      }
    };
    const action = {
      type: ActionTypes.ENTITY_UPDATE,
      objType: "customer",
      id: "123",
      data: {
        id: "321",
        name: "reset name"
      }
    };
    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });

  it("will add entity definition of all object types", function () {
    const lastFetchedTime = (new Date()).getTime();
    const expectedObj = {
      entities: {
        "customer-123" : {
          id: "321",
          name: "reset name"
        }
      },
      definitions: {
        "customer": {
          default_view: "default"
        },
        "project": {
          id: 1,
          obj_type: "project",
          lastFetchedTime: lastFetchedTime,
          lastFetched: lastFetchedTime
        },
        "notes": {
          id: 2,
          obj_type: "notes",
          lastFetchedTime: lastFetchedTime,
          lastFetched: lastFetchedTime
        }
      }
    };

    const action = {
      type: ActionTypes.ENTITY_DEFINITION_UPDATE_ALL,
      entityDefinitionAllObjTypes: [
        {
          id: 1,
          obj_type: "project",
          lastFetchedTime: lastFetchedTime
        },
        {
          id: 2,
          obj_type: "notes",
          lastFetchedTime: lastFetchedTime
        }
      ]
    };
    expect(entityReducer(originalState, action)).toEqual(expectedObj);
  });
});
