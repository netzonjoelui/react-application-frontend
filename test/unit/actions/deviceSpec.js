import * as ActionTypes from 'netric/actions/device';
import {updateOnline, updateSize} from 'netric/actions/device';
import {deviceSizes} from 'netric/models/device';

describe("Pure Actions", function() {
  it("should return an expected action when we call updateOnline", function() {
    const expectedObj = {
      type: ActionTypes.DEVICE_UPDATE_ONLINE,
      status: true
    };
    expect(updateOnline(true)).toEqual(expectedObj);
  });

  it("should return an expected action when we call updateSize", function() {
    const expectedObj = {
      type: ActionTypes.DEVICE_UPDATE_SIZE,
      size: deviceSizes.large
    };
    expect(updateSize(deviceSizes.large)).toEqual(expectedObj);
  });
});