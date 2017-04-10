import React from 'react';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { updateSize as updateDeviceSize } from '../actions/device';
import { fetchAccount } from '../actions/account';
import { getDeviceSize } from '../models/device';
import { ConnectedRouter } from 'react-router-redux';
import ChamelThemeProvider from 'chamel/lib/styles/ChamelThemeProvider';
import materialTheme from 'chamel/lib/styles/theme/material';
import ModuleContainer from './ModuleContainer';
import LoginContainer from './LoginContainer';
import LogoutContainer from './LogoutContainer';
import events from '../util/events';
import routerHistory from '../store/router-history';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Main application class for netric
 */
class ApplicationContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {
    deviceSize: React.PropTypes.number,
    deviceOnline: React.PropTypes.bool,
    isAuthenticated: React.PropTypes.bool,
    accountFetching: React.PropTypes.bool,
    accountName: React.PropTypes.string,
    accountOrgName: React.PropTypes.string,
    defaultModule: React.PropTypes.string
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props)
  }

  /**
   * Entered the DOM
   */
  componentDidMount() {
    // Set the device size
    this.setDeviceSize();

    // Listen for window resize events and update size
    events.on(window, 'resize', this.setDeviceSize);

    // Get account if we are authenticated
    if (this.props.isAuthenticated) {
      this.props.onLoadAccount();
    }
  }

  /**
   * Unregister any listeners
   */
  componentWillUnmount() {
    // Unlisten for window resize events and update size
    events.on(window, 'resize', this.setDeviceSize);
  }

  /**
   * About to receive new properties
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {

  }

  /**
   * Render the applicatoin
   *
   * @returns {Object}
   */
  render() {
    const isAuthenticated = this.props.isAuthenticated;

    // If we are fetching the account data then show loading
    if (this.props.accountFetching && !this.props.defaultModule) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"} />
          <div>Loading...</div>
        </div>
      );
    }

    // Get the default module
    const defaultModule = this.props.defaultModule || "login";

    return (
      <ChamelThemeProvider chamelTheme={materialTheme}>
        <ReduxProvider store={this.props.store}>
          <ConnectedRouter history={routerHistory}>
            <div>
              <Switch>
                <Route path={'/'} exact render={(props) => (
                    <Redirect to={{
                      pathname: '/' + defaultModule,
                      state: { from: props.location }
                    }}/>
                  )
                }/>
                <Route path="/login" exact render={(props) => {
                  let from = { pathname:'/' };

                  if (props.location.state && props.location.state.from) {
                    from = props.location.state.from;
                  }
                  return (<LoginContainer from={from}/>);
                }}/>
                <Route path="/logout" exact render={(props) => (<LogoutContainer />)}/>
                <Route path="/:module" render={(props) => {
                  if (isAuthenticated) {
                    return (
                      <ModuleContainer
                        moduleName={props.match.params.module}
                        currentRoutePath={props.match.url}
                      />
                    );
                  } else {
                    return (
                      <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                      }}/>
                    );
                  }
                }}/>
              </Switch>
            </div>
          </ConnectedRouter>
        </ReduxProvider>
      </ChamelThemeProvider>
    );
  }

  /**
   * Set the device size
   */
  setDeviceSize = () => {
    this.props.onUpdateDeviceSize(getDeviceSize());
  }
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {
  return {
    deviceSize: state.device.size,
    deviceOnline: state.device.online,
    accountFetching: state.account.fetching,
    accountName: state.account.name,
    accountOrgName: state.account.orgName,
    defaultModule: state.module.defaultModule,
    isAuthenticated: (state.account.user.authToken) ? true : false
  }
};

/**
 * Map container callbacks to dispatches into the redux state
 *
 * @param {Function} dispatch Callback to dispatch an action to the store
 * @returns {{onFetchModule: (function())}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateDeviceSize:(size) => {
      dispatch(updateDeviceSize(size));
    },
    onLoadAccount:() => {
      dispatch(fetchAccount());
    }
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationContainer);
