import {getActionsForObjType, getContainerForAction, actionModes} from 'netric/models/entity/userActions';

describe("getActionsForObjType", () => {
  it("should not return convertlead in the wrong mode", () => {
    const actionsBrowse = getActionsForObjType("lead", actionModes.browse);
    expect(actionsBrowse.hasOwnProperty("convertlead")).toBe(false);
  });

  it("should return convertlead in the right mode", () => {
    const actionsBrowse = getActionsForObjType("lead", actionModes.edit);
    expect(actionsBrowse.hasOwnProperty("convertlead")).toBe(true);
  });

  it("should not return convertlead for a task", () => {
    const actionsBrowse = getActionsForObjType("task", actionModes.edit);
    expect(actionsBrowse.hasOwnProperty("convertlead")).toBe(false);
  });
});

describe("getContainerForAction", () => {
  it("should get a custom container for mergeEntities", () => {
    const actionContainer = getContainerForAction("mergeEntities");
    expect(actionContainer).not.toBe(null);
  });

  it("should return a null container for remove", () => {
    const actionContainer = getContainerForAction("remove");
    expect(actionContainer).toBe(null);
  });
});