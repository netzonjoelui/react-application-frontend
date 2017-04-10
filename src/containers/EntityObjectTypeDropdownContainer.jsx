import React from 'react';
import { connect } from 'react-redux';
import Definition from '../models/entity/Definition';
import { fetchAllEntityDefinitions } from '../actions/entity';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Displays a dropdown that has all the entity object types
 */
class EntityObjectTypeDropdownContainer extends React.Component {
  /**
   * Set expected property types
   */
  static propTypes = {
    /**
     * Callback function that is called when fetching all the entity definitions
     *
     * @var {function}
     */
    onFetchEntityDefinitionAllObjTypes: React.PropTypes.func.isRequired,

    /**
     * The entity definition data of all object types that were loaded from the state
     *
     * @var {object}
     */
    allObjTypesDefinitionData: React.PropTypes.object,

    /**
     * Optional. The object type that was selected
     *
     * @var {string}
     */
    objType: React.PropTypes.string,

    /**
     * Callback called when the user selects an object type
     *
     * @var {function}
     */
    onChange: React.PropTypes.func
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {

    // Make sure that we have all the object types definition
    this.props.onFetchEntityDefinitionAllObjTypes();
  }

  /**
   * About to receive new properties
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {

    if (!nextProps.isEntityDefinitionAllObjTypesFetching
      && nextProps.allObjTypesDefinitionData !== this.state.allObjTypesDefinitionData) {
      this.setState({allObjTypesDefinitionData: nextProps.allObjTypesDefinitionData})
    }
  }

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
   * Render the Entity Object Type Dropdown
   *
   * @returns {Object}
   */
  render() {

    // Get the definition menu data
    let definitionsMenuData = this.getDefinitionMenuData();

    // Get the selected index of the objType
    let selectedIndex = (this.props.objType) ?
      this.getSelectedIndex(definitionsMenuData, this.props.objType) : 0;

    return (
      <DropDownMenu
        menuItems={definitionsMenuData}
        selectedIndex={parseInt(selectedIndex)}
        onChange={this.handleDefintionsMenuSelect}
      />
    )
  };

  /**
   * Callback used to handle the selecting of definition
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {array} menuItem The object value of the menu clicked
   * @private
   */
  handleDefintionsMenuSelect = (e, key, menuItem) => {
    if (this.props.onChange) this.props.onChange(menuItem.objType)
  };

  /**
   * Function that will loop thru state.entityDefinition (Entity/Definition) to get the objType and create a menu data
   *
   * @returns {Array} Menu data of the objTypes
   * @private
   */
  getDefinitionMenuData = () => {
    let definitionsMenuData = [];

    for (let idx in this.props.allObjTypesDefinitionData) {
      let entityDefinition = this.props.allObjTypesDefinitionData[idx];

      definitionsMenuData.push({
        objType: entityDefinition.obj_type,
        text: entityDefinition.title
      })
    }

    // Sort entityDefinition
    definitionsMenuData.sort(function (a, b) {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });

    // If no field name has been selected, enter a first explanation entry
    if (!this.props.objType) {
      definitionsMenuData.splice(0, 0, {
        objType: '',
        text: 'Select Object Type'
      });
    }

    return definitionsMenuData;
  };

  /**
   * Gets the index of an objType based on the name
   *
   * @param {Array} data Array of data that will be mapped to get the index of the saved objType
   * @param {string} value The value that will be used to get the index
   * @private
   */
  getSelectedIndex = (data, value) => {
    var index = 0;
    for (var idx in data) {
      if (data[idx].objType == value) {
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
  const moduleState = state.entity;

  return {
    allObjTypesDefinitionData: moduleState.definitions,
    isEntityDefinitionAllObjTypesFetching: moduleState.definitions.isEntityDefinitionAllObjTypesFetching,
    deviceSize: state.device.size,
  }
};

/**
 * Map container callbacks to dispatches into the redux state
 *
 * @param {Function} dispatch Callback to dispatch an action to the store
 * @returns {{onFetchEntityAllDefinitions: (function())}}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEntityDefinitionAllObjTypes: () => {
      // Get the entity definition from the server
      dispatch(fetchAllEntityDefinitions());
    }
  }
};

// Connect this container to listen to redux
export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityObjectTypeDropdownContainer);
