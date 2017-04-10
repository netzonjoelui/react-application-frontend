import {login, logout, updateAccount } from 'netric/actions/account';
import store from 'netric/store';

describe("integration account actions", () => {

  const localServer = 'http://devel.netric.com';

  /*
   * Setup each test
   */
  beforeEach(() => {
    store.dispatch(logout());
    store.dispatch(updateAccount({universalLoginUrl: localServer}));
  });

  it("should allow first login()", (done) => {

    store.dispatch(login("test@netric.com", "password")).then(() => {
      const state = store.getState();
      expect(state.account.user.authToken).not.toBeNull();
      expect(state.account.server).not.toBeNull();
      expect(state.account.id).not.toBeNull();
      done();
    }).catch((error) => {
      // we expect this not to happen
      expect(false).toBe(true);
      console.error(
        error.message,
        "File:" + error.fileName,
        "Line:" + error.lineNumber
      );
      done();
    });
  });

});