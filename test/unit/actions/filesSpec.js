import * as ActionTypes from 'netric/actions/files';
import {uploadFiles, filesUploaded} from 'netric/actions/files';
import { applyMiddleware, createStore } from 'redux';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk';

// Setup mock store
const mockStore = configureMockStore([thunk]);
const mockHost = 'mock://mockhost';

describe("Pure Actions", function () {
  let fileData = [
    {
      name: "test_file.png",
      ts_updated: 1480514529
    },
    {
      name: "new_file.png",
      ts_updated: 3485514541
    }
  ];

  let uploadingProcessId = "a82b3a2a22bb19d6";

  it("upload a new file", function () {
    const expectedObj = {
      type: ActionTypes.FILES_UPLOADED,
      data: fileData,
      processId: uploadingProcessId
    };

    expect(filesUploaded(fileData, uploadingProcessId)).toEqual(expectedObj);
  });
});

describe("Files actions", () => {

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

    // Mock out endpoint for saving group
    fetchMock.mock(
      mockHost + '/svr/files/upload',
      fileData
    );
  });

  /*
   * Cleanup each test
   */
  afterEach(() => {
    fetchMock.restore();
  });

  it("uploadFiles() should upload the FileList Object", (done) => {


    let uploadingProcessId = "a82b3a2a22bb19d6";
    let store = mockStore(mockState);

    // Actions that should be triggered
    const expectedActions = [{
      type: ActionTypes.FILES_UPLOADED,
      data: fileData,
      processId: uploadingProcessId
    }];

    let FileListObject = [
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

    let folderId = 1;
    let folderPath = "%tmp%";

    store.dispatch(uploadFiles(FileListObject, uploadingProcessId, folderId, folderPath))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});