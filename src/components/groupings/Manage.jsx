/**
 * Render the ui for Grouping Manager
 */
import React from 'react';
import theme from '../entity/form/entity-form.scss';
import EntityGroupingSelectContainer from '../../containers/EntityGroupingSelectContainer';
import groupingsModel from '../../models/entity/Groupings';
import groupModel from '../../models/entity/definition/Group';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import IconButton from 'chamel/lib/Button/IconButton';
import DropDownMenu from 'chamel/lib/Picker/SelectField';
import Snackbar from 'chamel/lib/Snackbar/Snackbar';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import SaveIcon from 'chamel/lib/icons/font/SaveIcon';
import DeleteIcon from 'chamel/lib/icons/font/DeleteIcon';

/**
 * Displays the ui for managing the grouping
 */
class ManageGrouping extends React.Component {

  /**
   * Define propTypes for this component
   */
  static propTypes = {
    /**
     * The Group Object that we are going to manage
     *
     * @type {Group}
     */
    group: React.PropTypes.instanceOf(groupModel),

    /**
     * The Groupings model that contains the information of a group
     *
     * @type {Groupings}
     */
    groupings: React.PropTypes.instanceOf(groupingsModel),

    /**
     * Callback function to save the group data
     *
     * @type {func}
     */
    onSave: React.PropTypes.func.isRequired,

    /**
     * Navigation back button - left arrow to the left of the title
     *
     * @type {func}
     */
    onNavBtnClick: React.PropTypes.func,

    /**
     * Message that will be displayed in the snackbar
     *
     * @type {string}
     */
    snackBarMessage: React.PropTypes.string
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      group: this.props.group,
      snackBarMessage: this.props.snackBarMessage
    }
  };

  componentDidUpdate() {
    // Hide the snackbar if the component did re-render
    if (this.state.snackBarMessage === '') {
      this.refs.snackbar.dismiss();
    }
  };

  render() {
    let elementLeft = null;
    if (this.props.onNavBtnClick) {
      elementLeft = (
        <IconButton
          key="back"
          onClick={this._handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
      );
    }

    let elementRight = [
      (
        <IconButton
          key="delete"
          onClick={this._handleRemove}>
          <DeleteIcon />
        </IconButton>
      ),
      (
        <IconButton
          key="save"
          onClick={this._handleSave}>
          <SaveIcon />
        </IconButton>
      )
    ];


    // Set the snackbar
    let snackbar = null;
    snackbar = <Snackbar ref="snackbar" message={this.state.snackBarMessage}/>;

    // Setup the color data
    let colorMenuData = [{payload: null, text: 'Select Color'}, {payload: 'blue', text: 'Blue'}, {
      payload: 'red',
      text: 'Red'
    }, {payload: 'green', text: 'Green'}];

    let selectedColorIndex = this._getSelectedIndex(colorMenuData, this.state.group.color);

    return (
      <div className={theme.entityForm}>
        <AppBar
          fixed={true}
          key="Save"
          title={"Manage Categories"}
          zDepth={0}
          iconElementLeft={elementLeft}
          iconElementRight={elementRight}
        />
        <div className={theme.entityFormField}>
          <TextField
            floatingLabelText='Name'
            ref='name'
            value={this.state.group.name}
            onBlur={this._handleTextChange.bind(this, 'name')}/>
        </div>
        <div className={theme.entityFormField}>
          <DropDownMenu
            selectedIndex={parseInt(selectedColorIndex)}
            ref='color'
            menuItems={colorMenuData}
            onChange={this._handleDropDownChange.bind(this, 'color')}/>
        </div>

        <div className={theme.entityFormField}>
          <EntityGroupingSelectContainer
            groups={this.props.groupings.getGroups()}
            ignore={[this.state.group.id]}
            selectedValue={this.state.group.parentId}
            label={"Select Parent"}
            onChange={this._handleDataChange.bind(this, 'parentId')}/>
        </div>
        {snackbar}
      </div>
    )
  };


  /**
   * The user clicked back in the toolbar/appbar
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @private
   */
  _handleBackClick = (evt) => {
    if (this.props.onNavBtnClick) {
      this.props.onNavBtnClick();
    }
  };

  /**
   * The changes the name text field
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @private
   */
  _handleTextChange = (type, evt) => {
    this._handleDataChange(type, evt.target.value);
  };

  /**
   * Handle when a user selects a value in the dropdown
   *
   * @private
   * @param {string} type The type of dropdown that was changed
   * @param {Event} evt Reference to the DOM event being sent
   * @param {int} selectedIndex The index of the item selected
   * @param {Object} menuItem The menu item clicked on
   */
  _handleDropDownChange = (type, evt, selectedIndex, menuItem) => {
    this._handleDataChange(type, menuItem.payload)
  };

  /**
   * Handle the saving of group values in the state
   *
   * @private
   * @param {string} type The type of group data that was changed
   * @param {int|string} value The group value that was changed
   */
  _handleDataChange = (type, value) => {
    let group = this.state.group;

    group[type] = value;
    this.setState({group});
  };

  /**
   * Handle event where the saves the group data
   *
   * @private
   */
  _handleSave = () => {

    /**
     * Determine what type of action we will be executing.
     * If group id is set, then we will edit the group,
     *  otherwise, we will execute the add function
     */
    let action = (this.state.group.id) ? 'edit' : 'add';

    // Call the action finished function and pass the state data
    this.props.onSave(action, this.props.groupings, this.state.group);

    // TODO: Find a way to display the succesful save message in the snackbar
    // Display a status that the changes are being saved
    // this.setState({snackBarMessage: 'Saving the changes...'});
    // this.refs.snackbar.show();
  };

  /**
   * Handle event where the user wants to delete the group
   *
   * @private
   */
  _handleRemove = () => {

    // Call the action finished function and pass the state data
    this.props.onSave('delete', this.props.groupings, this.state.group);

    // Display a status that the changes are being saved
    this.setState({snackBarMessage: 'Removing the group...'});
    this.refs.snackbar.show();
  }

  /**
   * Gets the index of the selected color
   *
   * @param {Array} data Array of data that will be mapped to get the index of the color
   * @param {string} value The value that will be used to get the index
   * @private
   */
  _getSelectedIndex = (data, value) => {
    let index = 0;
    for (let idx in data) {
      if (data[idx].payload == value) {
        index = idx;
        break;
      }
    }

    return index;
  };
}

export default ManageGrouping;
