import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { push as routerPathPush } from 'react-router-redux'
import { getActionsForObjType, actionModes } from '../models/entity/userActions';
import { fetchEntityDefinition, deleteEntity } from '../actions/entity';
import { fetchEntityCollection } from '../actions/entityCollection';
import { updateCurrentBrowserView } from '../actions/browserView';
import { deviceSizes } from '../models/device';
import Collection from '../models/entity/Collection';
import Definition from '../models/entity/Definition';
import BrowserView from '../models/entity/BrowserView';
import Entity from '../models/entity/Entity';
import EntityContainer from './EntityContainer';
import AdvancedSearchContainer from './AdvancedSearchContainer';
import EntityUserActionContainer from './EntityUserActionContainer';
import EntityBrowserComponent from '../components/entitybrowser/EntityBrowser';
import routerHistory from '../store/router-history';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Helper function to generate a Query object from properties
 *
 * @return Collection
 */
const getCollectionFromData = (props, browserViewData = null) => {
  const collection = new Collection(props.objType);

  // Make a copy of any passed arguments since we modify them below
  let conditions = (props.conditions) ? props.conditions.slice() : [];
  let orderBy = (props.order_by) ? props.order_by.slice() : [];

  // Add browser view conditions
  if (browserViewData) {

    const browserView = new BrowserView();

    // Import the browser view data
    browserView.fromData(browserViewData);

    const viewConditions = browserView.getConditions();
    for (let i in viewConditions) {
      conditions.push(viewConditions[i].toData());
    }

    const viewOrderBy = browserView.getOrderBy();
    for (let i in viewOrderBy) {
      orderBy.push(viewOrderBy[i].toData());
    }
  }

  const collectionData = {
    obj_type: props.objType,
    conditions: conditions,
    order_by: orderBy
  };

  collection.queryFromData(collectionData);

  return collection;
};

/**
 * Helper function that will loop thru the available list of browser view data and find the default view data
 *
 * @param {string} objType The Object type we will be using to create a new browserView when we cant find the default view
 * @param {int|string} defaultViewId The id of the view that we will use as default view
 * @param {array} browserViewDataList List of browser views data that we will loop thru to find the default view
 * @returns {defaultViewData} Return the default browser view data
 */
const getDefaultBrowserViewData = (objType, defaultViewId, browserViewDataList) => {

  let defaultViewData = null;

  // We will loop thru the available browserViews only if we have default view id
  if (defaultViewId && browserViewDataList) {

    // Loop thru the available browserViews to find the default view
    browserViewDataList.forEach((viewData, idx) => {

      // If we found a match, then set it as our default view and return the browser view data
      if (viewData.id == defaultViewId) {
        defaultViewData = viewData;
        return;
      }

      /*
       * Just in case we found the system default view, let's set it as our temporary default view
       * Until we finished looping thru the props.browserView
       */
      if (!defaultViewData && viewData.default) {
        defaultViewData = viewData;
      }
    });
  }

  // If we did not found any default view, then we need to construct a new default view data
  if (!defaultViewData) {
    let defaultViewData = Object.create({obj_type: objType, table_columns: ["id"]});
  }

  return defaultViewData;
};

/**
 * Main application class for netric
 *
 * Example of how this could be used to select an entity in a dialog (unless in mobile)
 * <EntityBrowserContainer objType={"user"} onSelectEntity={this.setUser} picker />
 *
 * Example of how this could be used to load up a browserView
 * <EntityBrowserContainer objType={"user"} browserView={browserView} />
 */
class EntityBrowserContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * Required object type this browser is displaying
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * Current path from react router
     */
    currentRoutePath: React.PropTypes.string.isRequired,

    /**
     * Callback set by redux .connect function to dispatch fetch action
     */
    onFetchEntityCollection: React.PropTypes.func.isRequired,

    /**
     * Array of entities (raw data) loaded in the given collection
     */
    entities: React.PropTypes.array,

    /**
     * Array of /entity/Where conditions
     */
    conditions: React.PropTypes.array,

    /**
     * Optional callback called when a user selects an entity
     */
    onSelectEntity: React.PropTypes.func,

    /**
     * Callback called any time a picker dialog is closed
     */
    onPickerClose: React.PropTypes.func,

    /**
     * Callback to be executed when a user selects and deletes entities
     */
    onDeleteEntities: React.PropTypes.func,

    /**
     * If set then show a menu (hamburger) icon and call this when clicked
     *
     * This is most commonly used in mobile mode where the parent module has a leftNav drawer to open
     */
    onToolbarLeftIconClick: React.PropTypes.func,

    /**
     * Icon to use for the icon to the left of the title
     */
    toolbarLeftIcon: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.element
    ]),

    /**
     * Title to display for the list
     */
    title: React.PropTypes.string,

    /**
     * Define what mode this browser is in
     *
     * page = full page and handles all subroutes
     * inline = embedded inline inside a form and will let the parent route with onSelectEntity
     * picker = has not subroutes and is used to pick one entity and calls onSelectEntity
     */
    mode: React.PropTypes.oneOf(["page", "inline", "picker"]),

    /**
     * The size of the device as defined by /Device.js
     */
    deviceSize: React.PropTypes.number,

    /**
     * Flag to indicate if the collection is being fetched from the server
     */
    collectionLoading: React.PropTypes.bool,

    /**
     * The total number of entities
     *
     * @var {integer}
     */
    entitiesTotalNum: React.PropTypes.number,

    /**
     * Entity definition data
     *
     * @var {object}
     */
    definitionData: React.PropTypes.object,

    /**
     * The initial collection that is loaded using the default props and default view
     *
     * @var {Collection}
     */
    collection: React.PropTypes.instanceOf(Collection),

    /**
     * Unique ID of a loaded collection
     *
     * @var {string}
     */
    collectionId: React.PropTypes.string,

    /**
     * If set to true we will re-fetch the collection so long as we are online
     */
    collectionIsDirty: React.PropTypes.bool,

    /**
     * Timestamp when the collection was last updated
     */
    collectionLastUpdated: React.PropTypes.number,

    /**
     * Collection of data from the object reference.
     *
     * If the entity browser is loaded from an entity form, then we need the referenced data
     *  so we will know what is the referenced object type and the referenced field we are dealing with.
     *
     * Sample initEntityData structure
     * {
     *  objType: customer,
     *  contact_id: 1,
     *  contact_id_fval: 'test contact'
     * }
     */
    initEntityData: React.PropTypes.object,

    /**
     * If true then no toolbar will be displayed
     */
    hideToolbar: React.PropTypes.bool,

    /**
     * Optional callback called when the user tries to create a new entity.
     *
     * If callback is provided, it will override the current createNewEntity function in this container
     */
    onCreateNewEntity: React.PropTypes.func,

    /**
     * This is a flag that will be set to true if the collectionId is not found in the collectionState
     */
    collectionIdNotFound: React.PropTypes.bool,

    /**
     * Callback set by redux .connect function to dispatch push action from react-router-redux
     *
     * The push function from react-router-redux pushes a new location to router's history, becoming the current location
     */
    onRoutePathChange: React.PropTypes.func
  };

  /**
   * Set default values
   */
  static defaultProps = {
    onSelectEntity: null,
    conditions: [],
    entities: null,
    collectionLoading: false,
    definitionData: null,
    title: "Browse",
    collection: null,
    collectionId: null,
    onToolbarLeftIconClick: null,
    mode: "page",
    initEntityData: null,
    hideToolbar: false,
    defaultViewId: "default",
    filter: null,
    flagDisplayAdvancedSearch: false
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedEntities: [],
      collection: props.collection || getCollectionFromData(this.props),
      currentBrowserViewData: null,
      showAdvancedSearch: false,
      userActions: [],
      showNewEntityForm: false,
      hideNoItemsMessage: false
    };
  }

  /**
   * Entered the DOM
   */
  componentDidMount() {
    // Check if the collection needs to be loaded
    if (this.props.collectionId) {
      this.props.onFetchEntityCollection(this.state.collection, this.props.collectionId);
    }

    // Check if we have not definition or if it has been 5 minutes since last pulled
    const MS_PER_MINUTE = 60000;
    const staleDate = (new Date()).getTime() - (5 * MS_PER_MINUTE);
    const lastUpdated = (this.props.definitionData && this.props.definitionData.lastFetched)
      ? this.props.definitionData.lastFetched : 0;
    if (lastUpdated < staleDate) {
      this.props.onFetchEntityDefinition(this.props.objType);
    }
  }

  /**
   * Handle incoming new props
   */
  componentWillReceiveProps(nextProps) {

    // Check if we should reload the collection because it was marked dirty for some reason
    if (
      nextProps.collectionIsDirty && !this.props.collectionIsDirty &&
      this.props.collectionId && !this.props.collectionLoading
    ) {
      this.props.onFetchEntityCollection(this.state.collection, nextProps.collectionId);
    }

    /*
     * If the collectionId is not found in the collectionState
     *  and nextProps.collectionId does not match with props.collectionId
     */
    if ((nextProps.collectionIdNotFound && nextProps.collectionId != this.props.collectionId)) {
      this.props.onFetchEntityCollection(this.state.collection, nextProps.collectionId);
    }
  }

  /**
   * Render the module
   *
   * @returns {Object}
   */
  render() {
    // If we have not finished loading the entity definition then display loading
    if (this.props.definitionData === null) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"}/>
          <div>{"Loading..."}</div>
        </div>
      );
    }

    const objDef = new Definition(this.props.definitionData);
    const browserViewData = this.state.currentBrowserViewData || this.props.currentViewData;

    // Create entities
    let entities = this.props.entities.map((entityData) => {
      return new Entity(objDef, entityData)
    });

    // Set the layout
    const layout = (this.props.deviceSize < deviceSizes.medium) ? 'compact' : 'table';

    // Get available actions for this object type
    const actions = getActionsForObjType(this.props.objType, actionModes.browse);

    // Add user-generated actions to be performed
    let userActionElments = this.state.userActions.map((actionName, index) => {
      return (
        <EntityUserActionContainer
          key={index}
          actionName={actionName}
          entityIds={this.state.selectedEntities}
          objType={this.props.objType}
          onCompleted={() => { this.refresh(); }}
        />
      );
    });

    let newEntityForm = null;
    if (this.state.showNewEntityForm) {
      newEntityForm = (
        <EntityContainer
          usePageModalFlag={true}
          forceEditModeFlag={true}
          objType={this.props.objType}
          onSaveEntity={this.closeEntity}
          initEntityData={this.props.initEntityData}
          onClose={this.closeEntity}
          currentRoutePath={this.props.currentRoutePath}
        />
      );
    }

    let displayAdvancedSearch = null;
    if (this.state.flagDisplayAdvancedSearch && browserViewData) {
      displayAdvancedSearch = (
        <AdvancedSearchContainer
          objType={this.props.objType}
          browserViewData={browserViewData}
          onApplySearch={this.applyView}
          onClose={this.closeAdvancedSearch}
          deviceSize={this.props.deviceSize}
        />
      );
    }

    // Setup the entity browser component
    const toolbarMode = (this.props.mode === "page") ? 'appbar' : 'toolbar';
    const hideToolbar = (this.props.hideToolbar) ? this.props.hideToolbar : false;

    return (
      <div>
        <Switch>
          <Route
            path={this.props.currentRoutePath + '/:id'}
            render={(props) => {
                let idToLoad = props.match.params.id;
                if (idToLoad === 'new') {
                  idToLoad = null;
                }

                return (
                  <EntityContainer
                    id={idToLoad}
                    objType={this.props.objType}
                    onClose={this.closeEntity}
                    toolbarMode={toolbarMode}
                    currentRoutePath={props.match.url}
                  />
                );
              }
            }
          />
          <Route
            path={this.props.currentRoutePath}
            exact
            render={(props) => (
              <EntityBrowserComponent
                title={this.props.title}
                actions={actions}
                deviceSize={this.props.deviceSize}
                entities={entities}
                selectedEntities={this.state.selectedEntities}
                browserViewData={browserViewData}
                layout={layout}
                collectionLoading={this.props.collectionLoading}
                filters={null}
                entitiesTotalNum={parseInt(this.props.entitiesTotalNum)}
                hideToolbar={hideToolbar}
                toolbarMode={toolbarMode}
                hideNoItemsMessage={this.props.hideNoItemsMessage}
                browserViewDataList={this.props.browserViewDataList}
                pathname={this.props.currentRoutePath}
                toolbarLeftIcon={this.props.toolbarLeftIcon}
                onToolbarLeftIconClick={this.props.onToolbarLeftIconClick}
                onEntityListClick={this.loadEntity}
                onEntityListSelect={this.selectEntity}
                onLoadMoreEntities={this.loadMoreEntities}
                onCreateNewEntity={this.createNewEntity}
                onTextSearch={this.handleTextSearch}
                onApplySearch={this.applyView}
                onAdvancedSearch={this.loadAdvancedSearch}
                onRefreshEntityList={this.refresh}
                onPerformAction={(actionName) => { this.performAction(actionName); }}
                onRemoveEntity={(entityId) => {

                  /*
                   * If entityId is provided, then we will replace the state.selectedEntities with the entityId that is being removed
                   * Since we will only be removing only one entity, then it is okay to replace the value of state.selectedEntities
                   */
                  if (entityId) {
                    this.setState({selectedEntities: [entityId]});
                  }

                  // Perform the action "remove"
                  this.performAction("remove");
                }}
              />
            )}
          />
        </Switch>
        {userActionElments}
        {newEntityForm}
        {displayAdvancedSearch}
      </div>
    );
  }

  /**
   * Add a full-text search condition to the collection
   *
   * @param {string} fullText
   */
  handleTextSearch = (fullText) => {
    // Add the full text query to this collection
    let collection = this.state.collection;
    collection.andWhere("*").equalTo(fullText);

    /*
     * We pass the collectionId that was previously loaded because we want to continue using
     * the old collection with the new condition since it is cached by id in the state.
     */
    this.props.onFetchEntityCollection(collection, this.props.collectionId);
  };

  /**
   * Load up the next page of entities - for infinite scroll
   *
   * @param {int} pageLoaded The number of the page to load
   */
  loadMoreEntities = (pageLoaded) => {
    // Add the full text query to this collection
    let collection = this.state.collection;

    let limit = collection.getLimit();
    limit += (pageLoaded * 25);
    collection.setLimit(limit);

    /*
     * We pass the collectionId that was previously loaded because we want to continue using
     * the old collection with the new condition since it is cached by id in the state.
     */
    this.props.onFetchEntityCollection(collection, this.props.collectionId);
  };

  /**
   * Handle when a user triest to load an entity
   *
   * @param {string} objType The type of entity being loaded
   * @param {string} oid The unique id of the entity to load
   * @param {string} title The title or name of the entity
   */
  loadEntity = (objType, oid, title) => {
    // Check if this browser is in select only mode
    if (this.props.onSelectEntity) {
      this.props.onSelectEntity(this.props.objType, oid, title);
    } else {
      this.props.onRouterPathChange(this.props.currentRoutePath + "/" + oid);
    }
  };

  /**
   * Close an open entity
   */
  closeEntity = () => {
    this.props.onRouterPathChange(this.props.currentRoutePath);

    // Close a new entity form
    this.setState({showNewEntityForm: false});
  };

  /**
   * Handle action when a user clicks the checkbox to select an entity or clear
   *
   * @param oid
   */
  selectEntity = (oid) => {
    let selected = this.state.selectedEntities;

    if (!oid) {
      selected = [];
    } else {
      let selectedAt = selected.indexOf(oid);

      if (selectedAt === -1) {
        selected.push(oid);
      } else {
        selected.splice(selectedAt, 1);
      }
    }

    this.setState({selectedEntities: selected});

    // If we are not in page-mode managing all our own routes,
    // then let the parent know about the entity selection
    if ("page" != this.props.mode) {
      this.props.onSelectEntity(this.props.objType, oid, "");
    }
  };

  /**
   * Handles the creating of new entity
   *
   * @param {object} opt_data Optional data that will be used to create the new entity
   */
  createNewEntity = (opt_data) => {

    this.setState({showNewEntityForm: true});
    return;

    /*
     * If onCreateNewEntity callback is provided, then let's call that callback
     * instead of executing the container's normal create new entity script
     */
    if (this.props.onCreateNewEntity) {
      this.props.onCreateNewEntity(opt_data);
    } else {
      if (this.props.mode === 'page') {
        this.props.onRouterPathChange(this.props.currentRoutePath + "/new");
      } else {
        this.setState({showNewEntityForm: true});
      }
    }
  };

  /**
   * Refresh the entity collection
   */
  refresh = () => {
    this.props.onFetchEntityCollection(this.state.collection, this.props.collectionId);
  };

  /**
   * Apply the browser view data to this collection
   *
   * @param {object} browserViewData The browser view data that will be applied as our current view for entity browser
   */
  applyView = (browserViewData) => {
    const currentBrowserViewData = Object.assign({}, browserViewData);
    const collection = getCollectionFromData(this.props, currentBrowserViewData);
    const collectionId = collection.getHash();

    // Update the current view data first, before we fetch the collection
    this.props.onApplyCurrentViewData(this.props.objType, browserViewData);
    this.props.onFetchEntityCollection(collection, collectionId);

    this.setState({
      currentBrowserViewData,
      collection
    });
  };

  /**
   * Show the advanced search
   */
  loadAdvancedSearch = () => {
    this.setState({flagDisplayAdvancedSearch: true})
  };

  /**
   * Close the advanced search and load the entity browser list
   */
  closeAdvancedSearch = () => {
    this.setState({flagDisplayAdvancedSearch: false})
  };

  /**
   * Add an action to the queue of actions to be processed
   *
   * @param {string} actionName
   */
  performAction = (actionName) => {
    let userActions = this.state.userActions.slice(0);
    userActions.push(actionName);
    this.setState({userActions: userActions});
  };
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {{todos: Array}}
 */
const mapStateToProps = (state, ownProps) => {

  // Setup the browser view list
  const stateBrowserView = state.browserView[ownProps.objType] || {};
  const browserViewDataList = (stateBrowserView.views) ? stateBrowserView.views.slice() : [];
  let currentViewData = stateBrowserView.currentViewData || null;

  // If we have no browser view data, then let's find the default browser view data
  if (!currentViewData) {
    const defaultViewId = stateBrowserView.default_view || "default";
    currentViewData = getDefaultBrowserViewData(ownProps.objType, defaultViewId, browserViewDataList);
  }

  const collection = getCollectionFromData(ownProps, currentViewData);
  const collectionId = collection.getHash();
  const collectionState = state.entity.collections;
  let entitiesState = [];
  let entitiesTotalNum = 0;
  let collectionLastUpdated = null;
  let collectionLoading = null;
  let collectionIsDirty = false;
  let collectionIdNotFound = false;

  // Get the collection state by ID
  if (collectionState[collectionId] && collectionState[collectionId].results) {
    entitiesState = collectionState[collectionId].results.entities;
    entitiesTotalNum = parseInt(collectionState[collectionId].results.total_num);
    collectionIsDirty = collectionState[collectionId].isDirty;
    collectionLastUpdated = parseInt(collectionState[collectionId].lastUpdated);
    collectionLoading = collectionState[collectionId].isLoading;
  } else {

    /*
     * If collectionId is not found in the collectionState then we need to set collectionIdNotFound to true
     * This will allow the entity collection to be fetched from the server and get the entities
     *
     * One of the scenarios where collectionId is not found in the collectionState
     *  is when applying a modified browserView where new conditions are set.
     * When new conditions are set in the browserView, collection will have a new hash which will result to new collectionId
     */
    collectionIdNotFound = true;
    collectionLoading = true;
  }

  // Get the entity definition data
  const definitionData = state.entity.definitions[ownProps.objType] || null;
  const deviceSize = state.device.size;

  // Get the current router path if provided from props, if not then get it from history
  const currentRoutePath = (ownProps.currentRoutePath) ? ownProps.currentRoutePath : routerHistory.location.pathname;

  return {
    entities: entitiesState,
    entitiesTotalNum,
    deviceSize,
    definitionData,
    collection,
    collectionId,
    currentViewData,
    browserViewDataList,
    collectionLastUpdated,
    collectionLoading,
    collectionIsDirty,
    collectionIdNotFound,
    currentRoutePath
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
    onFetchEntityCollection: (collection, collectionId) => {
      // If collectionId is passed then updates will be forced to this unique collection
      dispatch(fetchEntityCollection(collection, collectionId));
    },
    onDeleteEntities: (objType, ids) => {
      dispatch(deleteEntity(objType, ids));
    },
    onRouterPathChange: (routerPath) => {
      dispatch(routerPathPush(routerPath));
    },
    onApplyCurrentViewData: (objType, browserViewData) => {
      // Update the current browser view
      dispatch(updateCurrentBrowserView(objType, browserViewData));
    }
  }
};

// Connect this container to listen to redux
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityBrowserContainer);
