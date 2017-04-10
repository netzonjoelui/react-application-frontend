import React from 'react';
import { fetchGroupings }  from '../actions/groupings';
import { connect } from 'react-redux';


// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Main application class for netric
 */
class EntityGroupingSelectContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {
    /**
     * The groups that will be displayed in the select dropdown
     *
     * @type {array}
     */
    groups: React.PropTypes.array,

    /**
     * The type of object we are getting groupings for
     */
    objType: React.PropTypes.string,

    /**
     * The name of the grouping field to load
     */
    fieldName: React.PropTypes.string,

    /**
     * Callback to be fired as soon as a grouping is selected
     *
     * @type {func}
     */
    onChange: React.PropTypes.func,

    /**
     * List of groupings to exclude (already set in the entity)
     *
     * @type {array}
     */
    ignore: React.PropTypes.array,

    /**
     * Optional text label to use for the "add grouping" button/drop-down
     *
     * @type {func}
     */
    label: React.PropTypes.string,

    /**
     * Determine if we allow no/empty selection in the dropdown
     *
     * @type {bool}
     */
    allowNoSelection: React.PropTypes.bool,

    /**
     * Will contain a initial value if available
     *
     * @type {string}
     */
    selectedValue: React.PropTypes.string
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    label: 'Add',
    ignore: [],
    allowNoSelection: true,
    selectedValue: null
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.objType && this.props.fieldName) {

      // If we have objType and fieldName, then we can get the groupings data
      this.props.onFetchGroupings(this.props.objType, this.props.fieldName);
    }
  };

  /**
   * Render the component
   *
   * @returns {XML}
   */
  render() {
    let menuItems = [{payload: '', text: this.props.label}];

    this._addGroupingOption(this.props.groups, menuItems);

    let selectedIndex = (this.props.selectedValue) ?
      this._getSelectedIndex(menuItems, this.props.selectedValue) : 0;

    return (
      <DropDownMenu
        selectedIndex={parseInt(selectedIndex)}
        ref='dropdown'
        menuItems={menuItems}
        onChange={this._handleOnChange}
      />
    );
  };

  /**
   * Handle when a user selects a value from the menu
   *
   * @private
   * @param {Event} e
   * @param {int} selectedIndex The index of the item selected
   * @param {Object} menuItem The menu item clicked on
   */
  _handleOnChange = (e, selectedIndex, menuItem) => {
    if (this.props.onChange) {
      this.props.onChange(menuItem.payload, menuItem.text);
    }
  };

  /**
   * Iterate through groups and add to the options array
   *
   * @param {Array} groups Groups to addd
   * @param {Array} arrOptions UI Options array
   * @param {string} opt_prefix Optional string prefix for sub-groups
   * @private
   */
  _addGroupingOption = (groups, arrOptions, opt_prefix) => {
    const prefix = opt_prefix || "";
    // Add a '-' to the very first subgroup
    const nextPrefix = prefix + "-\u0020\u0020";

    for (let i in groups) {

      // If the group.id is in our ignore list, then we will just continue with the loop
      if (this.props.ignore.indexOf(groups[i].id) >= 0) {
        continue;
      }

      arrOptions.push({
        payload: groups[i].id,
        text: prefix + groups[i].name
      });

      // Recursively handle children
      if (groups[i].children && groups[i].children.length) {
        this._addGroupingOption(groups[i].children, arrOptions, nextPrefix);
      }
    }

    return arrOptions;
  };

  /**
   * Gets the index of the selected group
   *
   * @param {Array} data Array of data that will be mapped to get the index of the saved field/operator/blogic value
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


/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {
  let groups = [];

  if (state.groupings.hasOwnProperty(ownProps.objType)) {
    if (state.groupings[ownProps.objType].hasOwnProperty(ownProps.fieldName)) {
      groups = state.groupings[ownProps.objType][ownProps.fieldName].groups;
    }
  }

  return {
    groups
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
    onFetchGroupings: (objType, fieldName, opt_filter = null) => {
      dispatch(fetchGroupings(objType, fieldName, opt_filter));
    }
  }
};

// Connect this container to listen to redux
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGroupingSelectContainer);
