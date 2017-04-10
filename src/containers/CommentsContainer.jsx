import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { fetchEntityDefinition, saveEntity } from '../actions/entity';
import { push as routerPathPush } from 'react-router-redux'
import { deviceSizes } from '../models/device';
import EntityCommentComponent from '../components/EntityComments';
import PageModalComponent from '../components/PageModal';
import EntityDefinition from '../models/entity/Definition';
import Entity from '../models/entity/Entity';
import EntityBrowserContainer from './EntityBrowserContainer';
import Where from '../models/entity/Where';
import LinearProgress from 'chamel/lib/Progress/LinearProgress';
import Controls from '../components/Controls.jsx';
import routerHistory from '../store/router-history';
import log from '../log';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import CommentIcon from 'chamel/lib/icons/font/CommentIcon';

const COMMENT_OBJTYPE = "comment";
const CURRENT_USER_ID = -3; // -3 is 'current_user' on the backend

/**
 * Main application class for entity comments
 */
class CommentsContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {
    /**
     * Callback function that is called when fetching an entity definition
     *
     * @var {function}
     */
    onFetchEntityDefinition: React.PropTypes.func.isRequired,

    /**
     * Required. The object type of referenced entity that is using the comment module
     *
     * @var {string}
     */
    referencedObjType: React.PropTypes.string.isRequired,

    /**
     * The Id of referenced entity that is using the comment module
     *
     * @var {string}
     */
    referencedEntityId: React.PropTypes.string,

    /**
     * The current count of the comments associated to the referenced entity
     *
     * @var {string}
     */
    existingCommentsCount: React.PropTypes.string,

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
     * Current path from react router
     */
    currentRoutePath: React.PropTypes.string.isRequired,

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
    referencedEntityId: null,
    existingCommentsCount: 0,
    definitionData: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      attachedFiles: []
    }
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
      this.props.onFetchEntityDefinition(COMMENT_OBJTYPE);
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

    let condition = new Where("obj_reference");
    condition.equalTo(
      this.props.referencedObjType +
      ":" + this.props.referencedEntityId
    );

    let displayEntityComment = (
      <div>
        <EntityBrowserContainer
          objType={COMMENT_OBJTYPE}
          deviceSize={this.props.deviceSize}
          conditions={[condition.toData()]}
          mode={"inline"}
          hideToolbar={true}
          currentRoutePath={this.props.currentRoutePath}
        />
        <EntityCommentComponent
          attachedFiles={this.state.attachedFiles}
          onAttachFile={this.handleAttachFile}
          onRemoveFile={this.handleRemoveAttachedFile}
          onAddComment={this.handleAddComment}
        />
      </div>
    );

    return (
      <div>
        <Switch>
          <Route
            path={this.props.currentRoutePath}
            exact
            render={(props) => {
              if (this.props.deviceSize > deviceSizes.medium) {
                return (
                  <div>
                    {displayEntityComment}
                  </div>
                )
              } else {
                return (
                  <div>
                    <IconButton
                      onClick={this.handleShowComments}>
                      <CommentIcon />
                    </IconButton>
                    ({this.props.existingCommentsCount}) Comments
                  </div>
                )
              }
            }}
          />
          <Route
            path={this.props.currentRoutePath + '/comments'}
            render={(props) => {
              return (
                <div>
                  <PageModalComponent
                    match={props.match}
                    deviceSize={this.props.deviceSize}
                    title={"Comments (" + this.props.existingCommentsCount + ")"}
                    continueLabel={"Done"}
                    onCancel={this.handleHideComments}
                    onContinue={null}>
                    {displayEntityComment}
                  </PageModalComponent>
                </div>
              )
            }}
          />
        </Switch>
      </div>
    );
  }

  /**
   * Handles the showing of entity comments when viewing in small devices
   */
  handleShowComments = () => {
    this.props.onRouterPathChange(this.props.currentRoutePath + "/comments");
  };

  /**
   * Handles the hiding of entity comments when viewing in small devices
   */
  handleHideComments = () => {
    this.props.onRouterPathChange(this.props.currentRoutePath);
  };

  /**
   * Handles the removing of attached file
   *
   * @param {File} file The file that will be removed
   * @private
   */
  handleRemoveAttachedFile = (file) => {

    let attachedFiles = this.state.attachedFiles;

    // Loop thru the attached files and find the file that will be removed
    for (let idx in attachedFiles) {
      let attachedFile = attachedFiles[idx];

      // If we found the file, then let's splice it from the state.attachedFiles and exit the loop
      if (attachedFile.id == file.id) {

        attachedFiles.splice(idx, 1);
        break;
      }
    }

    this.setState({attachedFiles});
  };

  /**
   * Handles the removing of attached file
   *
   * @param {File} file Instance of the file model
   * @private
   */
  handleAttachFile = (file) => {
    this.state.attachedFiles.push(file);
  }

  /**
   * Add a new comment
   *
   * @param comment
   */
  handleAddComment = (comment) => {

    // Do not save an empty comment or if we have no attached file
    // && this.attachedFiles_.length == 0
    if (!comment) {
      return;
    }

    // Create a new comment entity
    let commentEntity = this.createNewEntity();

    // If commentEntity is null, then this.props.definitionData is not set and we should log an error
    if (commentEntity === null) {
      log.error("Cant save a comment because props.definitionData is not set.");
      return;
    }

    // Set the coment entity values
    commentEntity.setValue("comment", comment);

    // Attach the files into the comment entity
    for (let idx in this.state.attachedFiles) {
      let file = this.state.attachedFiles[idx];

      commentEntity.addMultiValue('attachments', file.id, file.name);
    }

    // Save the comment entity
    this.props.onSaveEntity(commentEntity);

    // Reset the attached files after saving the comment
    this.setState({
      attachedFiles: []
    });
  };

  /**
   * Create an entity model for comments
   *
   * @returns {Entity}
   */
  createNewEntity = () => {

    let commentEntity = null;

    // Make sure we have an entity definition and commentEntity is not yet created/stored in the state
    if (this.props.definitionData) {
      let definition = new EntityDefinition(this.props.definitionData);

      // Create the new entity
      commentEntity = new Entity(definition, {obj_type: COMMENT_OBJTYPE});

      commentEntity.setValue("owner_id", CURRENT_USER_ID);
      commentEntity.setValue("obj_reference", this.props.referencedObjType + ':' + this.props.referencedEntityId);
    }

    return commentEntity;
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
  const definitionData = state.entity.definitions[COMMENT_OBJTYPE] || null;

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
    onSaveEntity: (entity) => {
      // Get the entity definition from the server
      dispatch(saveEntity(entity));
    },
    onRouterPathChange: (routerPath) => {
      dispatch(routerPathPush(routerPath));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsContainer);
