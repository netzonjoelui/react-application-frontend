import React from 'react';
import UiXmlElement from './UiXmlElement.jsx';
import EntityModel from '../../models/entity/Entity';
import Loading from '../Loading.jsx';
import { getDeviceHeight, deviceSizes } from '../../models/device';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import Dialog from 'chamel/lib/Dialog/Dialog';
import FontIcon from 'chamel/lib/FontIcon';
import IconButton from 'chamel/lib/Button/IconButton';
import Toolbar from 'chamel/lib/Toolbar/Toolbar';
import ToolbarGroup from 'chamel/lib/Toolbar/ToolbarGroup';

// Chamel Icons
import CloseIcon from 'chamel/lib/icons/font/CloseIcon';
import SaveIcon from 'chamel/lib/icons/font/SaveIcon';

/**
 * Module shell
 */
class Entity extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * Current element node level
     *
     * @type {entity/form/FormNode}
     */
    elementNode: React.PropTypes.object,

    /**
     * Entity being worked on
     *
     * @type {Entity}
     */
    entity: React.PropTypes.instanceOf(EntityModel),

    /**
     * Optional default values for a new entity
     *
     * @type {object}
     */
    initEntityData: React.PropTypes.object,

    /**
     * Callback function that is called when changing a field value to the entity
     *
     * @type {function}
     */
    onChange: React.PropTypes.func,

    /**
     * Callback function that is called when performing an action
     *
     * @type {function}
     */
    onPerformAction: React.PropTypes.func,

    /**
     * Callback function that is called when cancelling the changes made to the entity
     *
     * @type {function}
     */
    onCancelChanges: React.PropTypes.func,

    /**
     * Callback function that is called when closing the entity component
     *
     * @type {function}
     */
    onClose: React.PropTypes.func,

    /**
     * Type of toolbar to be displayed.
     *
     * @type {string} appbar | toolbar
     */
    toolbarMode: React.PropTypes.oneOf(['appbar', 'toolbar']),

    /**
     * The current device size
     */
    deviceSize: React.PropTypes.number,

    /**
     * Actions that the user can perform on the entity
     */
    actions: React.PropTypes.object,

    /**
     * Determine if this form is in edit or view mode
     */
    editMode: React.PropTypes.bool,

    /**
     * Flag to indicate if we have unsaved changes
     */
    dirty: React.PropTypes.bool,

    /**
     * Current path from react router
     */
    currentRoutePath: React.PropTypes.string.isRequired,
  };

  static defaultProps = {
    toolbarMode: 'appbar'
  };

  /**
   * We will send the current route path down
   * through the form if any containers need to be loaded
   */
  static childContextTypes = {
    currentRoutePath: React.PropTypes.string
  };

  getChildContext() {
    return {
      currentRoutePath: this.props.currentRoutePath
    };
  }

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  }

  /**
   * Notify the application if we have changed modes
   */
  componentDidMount() {
    // If we are working with a device that supports status bar color, then set
    if (typeof cordova != "undefined" && typeof StatusBar != "undefined") {
      if (cordova.platformId == 'android') {
        // StatusBar.backgroundColorByHexString("#fff");
      }
    }
  }

  /**
   * Reutrn the entity component
   *
   * @returns {Object}
   */
  render() {

    let actions = this.props.actions;

    /*
     * Get right icons from entity actions
     */
    let rightIcons = [];
    if (!this.props.entity.id) {
      // If we are editing a new entity, then our only action should be to save
      rightIcons.push(
        <IconButton
          key={"save"}
          onClick={(evt) => { this.handleActionClick_("save")}}
          tooltip={"Save"}>
          <SaveIcon />
        </IconButton>
      );
    } else {
      // Show all user actions
      for (let name in actions) {
        const action = actions[name];

        /*
         * Check if we have a showif object in the action.
         * This will determine if we will display the action button based on the filter specified
         */
        if (action.showif) {
          // If ::evaluateShowIf() returns false, it means that the showif did not match the filter specified
          if (!this.evaluateShowIf(action.showif)) {
            continue;
          }
        }

        rightIcons.push(
          <IconButton
            key={name}
            onClick={this.handleActionClick_.bind(this, action.name)}
            tooltip={action.title}>
            <action.icon />
          </IconButton>
        );
      }
    }


    var appBar = "";
    var appBarClassName = (this.props.editMode) ? "edit" : "detail";

    // We are just keeping the z-depth flat/0 for now
    var appBarZDepth = 0;

    let appBarTitle = "New " + this.props.entity.def.title;

    if (this.props.entity.id) {
      appBarTitle = this.props.entity.def.title.toUpperCase() + "-" + this.props.entity.id;
    }

    let leftElement = null;

    if (this.props.onClose) {
      leftElement = (
        <IconButton onTap={this.navigationClick_}>
          <CloseIcon />
        </IconButton>
      );
    }

    // Show loading indicator if the entity is not yet loaded for the first time
    var body = null;
    if (this.props.entity.isLoading) {
      body = (<Loading />);
    } else {
      // render the UIXML form
      body = (
        <UiXmlElement
          elementNode={this.props.formElementNode}
          onChange={this.props.onChange}
          entity={this.props.entity}
          editMode={this.props.editMode}
          initEntityData={this.props.initEntityData}
          deviceSize={this.props.deviceSize}
        />
      );
    }

    // Add confirmation dialog for undoing changes
    var confirmActions = [
      {text: 'Cancel'},
      {text: 'Continue', onClick: this.undoChangesClick_}
    ];

    // Setup what type of toolbar we will be displaying
    let toolbar = null;

    if (this.props.toolbarMode === 'appbar') {
      toolbar = (
        <AppBar
          fixed={true}
          title={appBarTitle}
          className={appBarClassName}
          iconElementLeft={leftElement}
          iconElementRight={rightIcons}
          zDepth={appBarZDepth}
        />
      );
    } else if (this.props.toolbarMode === "toolbar") {
      toolbar = (
        <Toolbar secondary>
          <ToolbarGroup key={1} float="left">
            <IconButton
              key="cancel"
              tooltip="cancel"
              onClick={this.navigationClick_}>
              <CloseIcon />
            </IconButton>
            <IconButton
              key="save"
              tooltip="save"
              onClick={(evt) => { this.handleActionClick_("save") }}>
              <SaveIcon />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    // Style variables for the toolbar and body container
    let bodyContainerStyle = null;
    let toolbarContainerStyle = null;
    // Add styles if the size is Medium to large devices
    if (this.props.deviceSize >= deviceSizes.medium) {
        // Style to keep the toolbar on place
        toolbarContainerStyle = {
            width: "100%",
            zIndex: "1"
        };

        // Style to add height property based on the device height
        bodyContainerStyle = {
            position: "relative",
            height: getDeviceHeight() - 150 +  "px",
            minHeight: "0px",
            top: "64px"
        };
    }

    return (
      <div>
        <div style={toolbarContainerStyle}>
          {toolbar}
        </div>
        <div style={bodyContainerStyle}>
          {body}
        </div>
        <Dialog
          ref='confirm'
          title="Cancel Changes"
          actions={confirmActions}
          modal={true}>
          This will undo any changes you made.
        </Dialog>
      </div>
    );
  }

  /**
   * The navigation button was clicked
   *
   * @param {Event} evt Event fired
   */
  navigationClick_ = (evt) => {

    if (this.props.editMode && this.props.dirty) {
      // Prompt user to make sure they want to undo their changes
      this.refs.confirm.show();
    }
    else if (this.props.onClose) {
      this.props.onClose(evt);
    }
  };

  /**
   * The user clicked confirm to undo changes
   *
   * @param {Event} evt Event fired
   */
  undoChangesClick_ = (evt) => {
    // Hide the dialog
    this.refs.confirm.dismiss();

    // Go back to view mode if we are editing an existing entity
    if (this.props.entity.id) {
      this.props.onPerformAction('view');
    } else if (this.props.onClose) {
      // If we are not editing an existing entity, then just close
      this.props.onClose();
    }

    // Notify the parent (probably a controller)
    if (this.props.onCancelChanges) {
      this.props.onCancelChanges();
    }
  };

  evaluateShowIf = (showIf) => {
    var parts = showIf.split("=");
    var refField = parts[0];
    var refValue = parts[1];

    // If refValue has a string value of null, then lets convert it to null value
    if (refValue === "null") {
      refValue = null;
    }

    // If it did not match with the entity field value, then return true
    if (this.props.entity.getValue(refField) == refValue) {
      return true;
    } else if (this.props[refField] == refValue) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Handle when an action is clicked from the app/tool bar
   *
   * @param actionName
   * @private
   */
  handleActionClick_ = (actionName) => {
    this.props.onPerformAction(actionName);
  };

}

export default Entity;
