import * as ActionTypes from 'netric/actions/groupings';
import groupingsReducer from 'netric/reducers/groupings';
import EntityGroupings from 'netric/models/entity/Groupings';
import GroupDefinition from 'netric/models/entity/definition/Group';

describe("Groupings reducer", function () {
  let groupings = new EntityGroupings("customer", "groups");
  let group = new GroupDefinition({
    id: 1,
    fieldName: "testfield",
    name: 'new_group'
  });

  groupings.addGroup(group);

  const originalState = {};

  it("can update a groupings data", function () {
    const expectedObj = {
      "customer": {
        "testfield" : groupings.getData()
      }
    };
    const action = {
      type: ActionTypes.GROUPINGS_UPDATE,
      fieldName: "testfield",
      objType: "customer",
      groupingsData: groupings.getData()
    };

    expect(groupingsReducer(originalState, action)).toEqual(expectedObj);
  });
});
