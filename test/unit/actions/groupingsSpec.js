import * as ActionTypes from 'netric/actions/groupings';
import {updateEntityFieldGroupings, fetchGroupings, saveGroup} from 'netric/actions/groupings';
import EntityGroupings from 'netric/models/entity/Groupings';
import GroupDefinition from 'netric/models/entity/definition/Group';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';

// Setup mock store
const mockStore = configureMockStore([thunk]);
const mockHost = 'mock://mockhost';

describe("Pure Actions", function () {
  it("should return an expected action when we call updateEntityFieldGroupings", function () {

    let groupings = new EntityGroupings("customer", "groups");

    const expectedObj = {
      type: ActionTypes.GROUPINGS_UPDATE,
      fieldName: "groups",
      objType: groupings.objType,
      groupingsData: groupings.getData()
    };
    expect(updateEntityFieldGroupings(groupings.getData())).toEqual(expectedObj);
  });
});

describe("Groupings pure actions", () => {

  const objType = "customer";
  let groupings = new EntityGroupings("customer", "groups");

  let saveGroupId = 1;
  let saveGroupName = 'save_group';

  /*
   * Setup each test
   */
  beforeEach(() => {

    // Mock out endpoint for fetching groupings
    fetchMock.mock(
      mockHost + '/svr/entity/getGroupings',
      groupings.getData()
    );

    // Mock out endpoint for saving group
    fetchMock.mock(
      mockHost + '/svr/entity/saveGroup',
      {
        id: saveGroupId,
        name: saveGroupId,
      }
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("saveGroup() should add a new group", (done) => {

    let group = new GroupDefinition({
      id: null,
      name: saveGroupName
    });

    let expectedGroupingsData = groupings.getData();
    let expectedGroupData = group.getData();

    // Set the group id to simulate the saving of adding a new group
    expectedGroupData.id = saveGroupId;

    // Push the groupings into the expectedGroupingData to simulate the adding of group
    expectedGroupingsData.groups.push(expectedGroupData);

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.GROUPINGS_UPDATE,
        objType: objType,
        fieldName: 'groups',
        groupingsData: expectedGroupingsData
      }
    ];
    const store = mockStore({});

    store.dispatch(saveGroup('add', groupings, group, 'auth1234', mockHost))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it("saveGroup() should edit an existing group", (done) => {

    let existingGroup = new GroupDefinition({
      id: 2,
      name: 'existing_group'
    });

    // Add the group in the groupings so we will have an existing group
    groupings.addGroup(existingGroup);

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.GROUPINGS_UPDATE,
        objType: objType,
        fieldName: 'groups',
        groupingsData: groupings.getData()
      }
    ];
    const store = mockStore({});

    store.dispatch(saveGroup('edit', groupings, existingGroup, 'auth1234', mockHost))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it("saveGroup() should remove an existing group", (done) => {

    let removeExistingGroup = new GroupDefinition({
      id: 3,
      name: 'remove_existing_group'
    });

    // Add the existing group in the groupings so we can test the remove group
    groupings.addGroup(removeExistingGroup);

    let expectedGroupingsData = groupings.getData();
    let groupsCount = expectedGroupingsData.groups.length;

    // Splice the latest added group into the groupings data to simulate the removing of group
    expectedGroupingsData.groups.splice(groupsCount-1, 1);

    // Actions that should be triggered
    const expectedActions = [
      {
        type: ActionTypes.GROUPINGS_UPDATE,
        objType: objType,
        fieldName: "groups",
        groupingsData: expectedGroupingsData
      }
    ];
    const store = mockStore({});

    store.dispatch(saveGroup('delete', groupings, removeExistingGroup, 'auth1234', mockHost))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});