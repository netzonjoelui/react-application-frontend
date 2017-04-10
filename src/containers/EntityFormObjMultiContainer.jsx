import React from 'react';
import pluralize from 'pluralize';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { fetchEntityDefinition, saveEntity, fetchEntity } from '../actions/entity';
import { push as routerPathPush } from 'react-router-redux'
import { deviceSizes } from '../models/device';
import PageModalComponent from '../components/PageModal';
import EntityDefinition from '../models/entity/Definition';
import EntityBrowserContainer from './EntityBrowserContainer';
import Where from '../models/entity/Where';
import LinearProgress from 'chamel/lib/Progress/LinearProgress';
import routerHistory from '../store/router-history';

// Chamel Controls
import ListItem from 'chamel/lib/List/ListItem';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';

/**
 * Display an entity browser within an entity form for referenced entities.
 * For example, this would be used to render an inline entity browser for
 * all tasks that might be under a project.
 */
class EntityFormObjMultiContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * The object type of the entities we are displaying
     *
     * @var {string}
     */
    objType: React.PropTypes.string.isRequired,

    /**
     * The field that will reference another entity for filtering
     *
     * If we are loading tasks inside of a project form then
     * the value of this field would be something like project_id if
     * that were the name of the field in the task entity that
     * referenced a project.
     *
     * @var {string}
     */
    referencedField: React.PropTypes.string.isRequired,

    /**
     * The ID of an entity to filter on in combination with referencedField
     *
     * Where referencedField above would indicate which field we should use
     * to filter the list of entities, this would be used to indicate which
     * ID we are filtering project_id on.
     *
     * @var {string}
     */
    referencedEntityId: React.PropTypes.string.isRequired,

    /**
     * Optional name of the referenced entity
     */
    referencedEntityName: React.PropTypes.string,

    /**
     * The current device size
     *
     * @var {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * The entity definition data that was loaded from the entity definition state
     *
     * @var {object}
     */
    definitionData: React.PropTypes.object,

    /**
     * Callback function that is called when fetching an entity definition
     *
     * @var {function}
     */
    onFetchEntityDefinition: React.PropTypes.func.isRequired,

    /**
     * Optional callback called when a user selects an entity
     */
    onSelectEntity: React.PropTypes.func,

    /**
     * Current path from react router
     */
    currentRoutePath: React.PropTypes.string.isRequired,
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
   * Get the router object so we can push URLs
   */
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    match: React.PropTypes.object
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.definitionData === null) {
      this.props.onFetchEntityDefinition(this.props.objType);
    }
  }

  /**
   * Render the applicatoin
   *
   * @returns {Object}
   */
  render() {
    // If the entity definition has not loaded then just show a loader
    if (!this.props.definitionData) {
      return (
        <div>
          <LinearProgress mode={"indeterminate"}/>
          <div>Loading...</div>
        </div>
      );
    }

    const entityDefinition = new EntityDefinition(this.props.definitionData);

    let condition = new Where(this.props.referencedField);
    condition.equalTo(this.props.referencedEntityId);

    // Set default field values for created entities
    const initEntityData = {
      [this.props.referencedField]: this.props.referencedEntityId,
      [this.props.referencedField + "_fval"]: this.props.referencedEntityName
    };

    return (
      <div>
        <Switch>
          <Route
            path={this.props.currentRoutePath}
            exact
            render={(props) => {
              if (this.props.deviceSize > deviceSizes.medium) {
                // Larger devices load the browser inline
                return (
                  <div>
                    <EntityBrowserContainer
                      objType={this.props.objType}
                      deviceSize={this.props.deviceSize}
                      conditions={[condition.toData()]}
                      mode={"inline"}
                      hideToolbar={false}
                      initEntityData={initEntityData}
                      onSelectEntity={this.props.onSelectEntity}
                      currentRoutePath={this.props.currentRoutePath}
                    />
                  </div>
                );
              } else {
                // Smaller devices load the browser in a new page
                return (
                  <ListItem
                    primaryText={pluralize(entityDefinition.title)}
                    onTap={this.openEntityBrowser}
                  />
                );
              }
            }}
          />
          <Route
            path={this.props.currentRoutePath + '/' + this.props.objType}
            render={(props) => {
              return (
                <PageModalComponent
                  deviceSize={this.props.deviceSize}
                  title={entityDefinition.title}
                  continueLabel={"Done"}
                  onCancel={this.closeEntityBrowser}
                  hideAppbarFlag={true}
                  onContinue={null}>
                    <EntityBrowserContainer
                      objType={this.props.objType}
                      deviceSize={this.props.deviceSize}
                      conditions={[condition.toData()]}
                      mode={"page"}
                      hideToolbar={false}
                      initEntityData={initEntityData}
                      toolbarLeftIcon={ArrowBackIcon}
                      onToolbarLeftIconClick={this.closeEntityBrowser}
                      onSelectEntity={this.props.onSelectEntity}
                    />
                </PageModalComponent>
              )
            }}
          />
        </Switch>
      </div>
    );
  }

  /**
   * Route the user to an entity browser if not displayed inline
   */
  openEntityBrowser = () => {
    this.props.onRouterPathChange(this.props.currentRoutePath + "/" + this.props.objType);
  };

  /**
   * Route up a level to close the browser if it was not loaded inline
   */
  closeEntityBrowser = () => {
    this.props.onRouterPathChange(this.props.currentRoutePath);
  };
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const deviceSize = state.device.size;
  const definitionData = state.entity.definitions[ownProps.objType] || null;

  // Get the current router path if provided from props, if not then get it from history
  const currentRoutePath = (ownProps.currentRoutePath) ? ownProps.currentRoutePath : routerHistory.location.pathname;

  return {
    deviceSize,
    definitionData,
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
    onRouterPathChange: (routerPath) => {
      dispatch(routerPathPush(routerPath));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityFormObjMultiContainer);
