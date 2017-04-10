import * as ActionTypes from 'netric/actions/device';
import {updateOnline, updateSize} from 'netric/actions/device';
import {deviceSizes} from 'netric/models/device';

describe("Test Async", function() {

  // This is where we will be using jasmin async to test server calls
  it("should return an expected action ", function() {
    const expectedObj = {
      type: ActionTypes.DEVICE_UPDATE_ONLINE,
      status: true
    };
    expect(updateOnline(true)).toEqual(expectedObj);
  });

});