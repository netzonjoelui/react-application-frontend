import {saveBrowserView, setDefaultBrowserView} from 'netric/actions/browserView';
import {login, logout, updateAccount } from 'netric/actions/account';
import BrowserView from 'netric/models/entity/BrowserView';
import store from 'netric/store';


describe("integration browserView actions", () => {

  let browserView = new BrowserView("customer");

  /*
   * Setup each test by clearing everything
   */
  beforeEach(() => {
    store.dispatch(logout());
    store.dispatch(updateAccount({universalLoginUrl: 'http://devel.netric.com'}));
  });

  it("should save the customer browser view", (done) => {
    // First we need to login, then we can save the browser view
    store.dispatch(login("test@netric.com", "password")).then(() => {
      // Save browser
      store.dispatch(saveBrowserView(browserView)).then(() =>{
        const state = store.getState();
        expect(state.browserView.customer).not.toBeNull();
        expect(state.browserView.customer.views[0].id).not.toBeNull();
        done();
      }).catch((error) => {
        // we expect this not to happen
        expect(false).toBe(true);
        console.error("Failed to save the browser view", error);
        done();
      });
    }).catch((error) => {
      // we expect this not to happen
      expect(false).toBe(true);
      console.error(error);
      done();
    });
  });
});