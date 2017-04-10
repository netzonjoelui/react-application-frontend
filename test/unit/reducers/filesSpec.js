import * as ActionTypes from 'netric/actions/files';
import filesReducer from 'netric/reducers/files';

describe("Files reducer", function () {
  let fileData = [
    {
      id: 1,
      name: "test_file.png",
      ts_updated: 1480514529
    },
    {
      id: 2,
      name: "new_file.png",
      ts_updated: 3485514541
    }
  ];

  const originalState = {
    uploadedFiles: {}
  };

  it("can upload a new file", function () {

    let uploadingProcessId = "a82b3a2a22bb19d6";

    const expectedObj = {
      uploadedFiles: {}
    };

    expectedObj.uploadedFiles[uploadingProcessId] = fileData;

    const action = {
      type: ActionTypes.FILES_UPLOADED,
      data: fileData,
      processId: uploadingProcessId
    };

    expect(filesReducer(originalState, action)).toEqual(expectedObj);
  });
});
