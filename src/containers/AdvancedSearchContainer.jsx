import React from 'react';
import { connect } from 'react-redux';
import { fetchEntityDefinition } from '../actions/entity';
import { saveBrowserView, setDefaultBrowserView } from '../actions/browserView';
import AdvancedSearchComponent from '../components/AdvancedSearch';
import SaveViewComponent from '../components/advancedsearch/SaveView';
import BrowserView from '../models/entity/BrowserView';
import PageModalComponent from '../components/PageModal';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Container class for Advanced Search
 */
class AdvancedSearchContainer extends React.Component {

  /**
   * Define propTypes for this component
   */
  static propTypes = {

    /**
     * The object type we are working with
     *
     * @type {string}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * The browser view data that will be used by advanced search
     *
     * @type {object}
     */
    browserViewData: React.PropTypes.object.isRequired,

    /**
     * Callback function that will fetch the entity definition
     *
     * @type {func}
     */
    onFetchEntityDefinition: React.PropTypes.func.isRequired,

    /**
     * Callback function that will close the advanced search
     *
     * @type {func}
     */
    onClose: React.PropTypes.func,

    /**
     * Callback function that will apply the current/modified browser view to the entity browser
     *
     * @type {func}
     */
    onApplySearch: React.PropTypes.func,

    /**
     * Object data that will be used to create entity/EntityDefinition
     *
     * @type {object}
     */
    definitionData: React.PropTypes.object,

    /**
     * The size of the device as defined by /Device.js
     */
    deviceSize: React.PropTypes.number,
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    onClose: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      browserViewData: this.props.browserViewData,
      flagDisplaySaveView: false,
    }
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.definitionData === null) {
      // If loading a new entity then we should at least get the definition
      this.props.onFetchEntityDefinition(this.props.objType);
    }
    // TODO: We should check here if we need to update the definition (10 minutes?)
  };

  /**
   * Render the advanced search container
   *
   * @returns {Object}
   */
  render() {

    if (this.state.flagDisplaySaveView) {

      // Display the save view component
      return (
        <PageModalComponent
          key="PageModalSaveView"
          hideAppbarFlag={true}
          deviceSize={this.props.deviceSize}
          onCancel={this.handleCloseSaveView}
        >
          <SaveViewComponent
            browserViewData={this.state.browserViewData}
            onSaveView={this.handleSaveView}
            onClose={this.handleCloseSaveView}
            onChange={this.handleBrowserViewChange}
          />
        </PageModalComponent>
      );
    }

    // We need to have a definition data before displaying the advanced search component
    if (this.props.definitionData) {

      // Display the advanced search component
      return (
        <PageModalComponent
          key="PageModalAdvancedSearch"
          hideAppbarFlag={true}
          deviceSize={this.props.deviceSize}
          onCancel={this.props.onClose}
        >
          <AdvancedSearchComponent
            browserViewData={this.state.browserViewData}
            definitionData={this.props.definitionData}
            objType={this.props.objType}
            onClose={this.props.onClose}
            onApplySearch={this.props.onApplySearch}
            onSetDefaultView={this.handleSetDefaultView}
            onDisplaySaveView={this.handleDisplaySaveView}
          />
        </PageModalComponent>
      );
    }

    return (
      <div>
        <LinearProgress
          mode={"indeterminate"}
        />
        <div>{"Loading..."}</div>
      </div>
    );
  };

  /**
   * Handles the saving of browser view
   */
  handleSaveView = () => {
    const browserView = new BrowserView();

    browserView.fromData(this.state.browserViewData);
    this.props.onSaveView(browserView);
    this.handleCloseSaveView();

  };

  /**
   * Handles the setting of browser view as default view
   *
   * @param browserViewData The browser view data we are going to save
   */
  handleSetDefaultView = (browserViewData) => {
    const browserView = new BrowserView();

    browserView.fromData(browserViewData);
    browserView.default = true; // Set the browser view as our default view

    this.props.onSetDefaultView(browserView.getData());
  };

  /**
   * Handles the displaying of save form for browser view
   *
   * @param browserViewData The browser view data we are going to save
   */
  handleDisplaySaveView = (browserViewData) => {
    const browserView = new BrowserView();
    browserView.fromData(browserViewData);

    // If the browserView is not yet saved, then set the default name to My Custom View
    if (browserView.id === null || browserView.system) {

      // Set the browser view as a new view to save. Make sure to set the id to null and system to false
      browserView.fromData({
        id: null,
        name: "My Custom View",
        system: false
      });
    }

    this.setState({
      flagDisplaySaveView: true,
      browserViewData: browserView.getData()
    });
  };

  /**
   * Handles the closing of save form for browser view
   */
  handleCloseSaveView = () => {
    this.setState({flagDisplaySaveView: false});
  };

  /**
   * Handles the changing of browser view details
   *
   * @param {Object} changedBrowserViewData Contains the changes made to the browser view (e.g. {name: new_view_name})
   */
  handleBrowserViewChange = (changedBrowserViewData) => {

    const browserView = new BrowserView();

    // Apply first the browser view data set in the state
    browserView.fromData(this.state.browserViewData);

    // Now set the changes made to the browser view data
    browserView.fromData(changedData);

    this.setState({
      browserViewData: browserView.getData()
    });
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
  const definitionData = state.entity.definitions[ownProps.objType] || null;

  return {
    definitionData: definitionData
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
    onFetchEntityDefinition: (objType) => {
      // Get the entity definition from the server
      dispatch(fetchEntityDefinition(objType));
    },

    onSaveView: (browserView) => {
      // Save the browser view to the server
      dispatch(saveBrowserView(browserView));
    },

    onSetDefaultView: (browserView) => {
      // Save the browser view as the default view to the server
      dispatch(setDefaultBrowserView(browserView));
    }
  }
};

// Connect this container to listen to redux
const VisibleAdvancedSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedSearchContainer);

export default VisibleAdvancedSearchContainer;
