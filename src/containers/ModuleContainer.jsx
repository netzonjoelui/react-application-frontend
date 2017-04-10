import React from 'react';
import { connect } from 'react-redux';
import { fetchModule } from '../actions/module';
import { deviceSizes } from '../models/device';
import { push as routerPathPush } from 'react-router-redux'
import LinearProgress from 'chamel/lib/Progress/LinearProgress';
import ModuleComponent from '../components/Module';

/**
 * Main application class for netric
 */
class ModuleContainer extends React.Component {
  
  static propTypes = {
    /**
     * ModuleName will not be set by redux, it MUST be provided by the parent component
     */
    moduleName: React.PropTypes.string.isRequired,

    /**
     * Most all of the other params will be loaded from redux with mapStateToProps
     * ---------------------------------------------------------------------------------
     */
    availableModules: React.PropTypes.array.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    lastUpdated: React.PropTypes.number,
    onFetchModule: React.PropTypes.func.isRequired,
    title: React.PropTypes.string,
    icon: React.PropTypes.string,
    defaultRoute: React.PropTypes.string,
    navigation: React.PropTypes.array,

    /**
     * The size of the device as defined by ../models/device.js
     */
    deviceSize: React.PropTypes.number,

    /**
     * Current route path for this module
     */
    currentRoutePath: React.PropTypes.string,

    /**
     * Callback set by redux .connect function to dispatch push action from react-router-redux
     *
     * The push function from react-router-redux pushes a new location to router's history, becoming the current location
     */
    onRoutePathChange: React.PropTypes.func
  };

  /**
   * Get the router object so we can push URLs
   */
  static contextTypes = {
    router: React.PropTypes.object
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  }

  /**
   * Entered the DOM
   */
  componentDidMount() {
    this.props.onFetchModule(this.props.moduleName);
  }

  /**
   * About to receive new properties
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.moduleName !== this.props.moduleName && !nextProps.isFetching) {
      this.props.onFetchModule(nextProps.moduleName);
    }
  }

  /**
   * Render the module
   * @returns {JSX}
   */
  render() {
    if (this.props.isFetching && this.props.navigation.length == 0) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"} />
          <div>Loading...</div>
        </div>
      );
    } else {
      return (
        <ModuleComponent 
          name={this.props.moduleName}
          title={this.props.title}
          leftNavItems={this.props.navigation}
          pathname={this.props.currentRoutePath}
          defaultRoute={this.props.defaultRoute}
          leftNavDocked={(this.props.deviceSize > deviceSizes.medium)}
          modules={this.props.availableModules}
          onModuleChange={this.changeModule}
          entityGroupings={this.props.entityGroupings}
          onRouterPathChange={this.changeRoutePath}
        />
      );
    }
  }

  /**
   * Switch which module we are loading
   *
   * @param {string} moduleName The name of the module to load
   */
  changeModule = (moduleName) => {
    this.changeRoutePath('/' + moduleName)
  }

  /**
   * Update the current route path
   *
   * @param {string} routePath The current route path
   */
  changeRoutePath = (routePath) => {
    this.props.onRouterPathChange(routePath);
  }
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {{todos: Array}}
 */
const mapStateToProps = (state, ownProps) => {
  const moduleState = state.module;
  const currentModelData = state.module.modules[ownProps.moduleName] || {};
  const userId = state.account.user.id || null;

  return {
    isFetching: moduleState.isFetching,
    title: currentModelData.title || "Loading...",
    icon: currentModelData.icon || "",
    defaultRoute: currentModelData.defaultRoute || "",
    navigation: currentModelData.navigation || [],
    deviceSize: state.device.size,
    availableModules: state.module.availableModules,
    entityGroupings: state.groupings || {}
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
    onFetchModule: (moduleName) => {
      dispatch(fetchModule(moduleName))
    },
    onRouterPathChange: (routerPath) => {
      dispatch(routerPathPush(routerPath));
    }
  }
};

// Connect this container to listen to redux
const VisibleModuleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleContainer);

export default VisibleModuleContainer;