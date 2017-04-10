import React from 'react';
import { connect } from 'react-redux';
import { fetchEntityDefinition } from '../actions/entity';
import EntityDefinition from '../models/entity/Definition';
import FieldsDropDownComponent from '../components/entity/FieldsDropDown';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Displays a dropdown that has all fields for an object type
 */
class EntityFieldsDropDownContainer extends React.Component {

  /**
   * Define propTypes for this component
   */
  static propTypes = {

    /**
     * The object type we are working with
     *
     * @type {string}
     */
    objType: React.PropTypes.string.isRequired
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.definitionData === null) {

      // Load the entity definition data if it is not available
      this.props.onFetchEntityDefinition(this.props.objType);
    }
  };

  /**
   * Render the entity fields dropdown
   *
   * @returns {Object}
   */
  render() {

    if (this.props.definitionData) {

      // Display the advanced search component
      return (
        <FieldsDropDownComponent
          {...this.props}
          definitionData={this.props.definitionData}
        />
      );
    } else {
      return (
        <div>
          <LinearProgress
            mode={"indeterminate"}
          />
          <div>Loading...</div>
        </div>
      );
    }
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
    }
  }
};

// Connect this container to listen to redux
const VisibleEntityFieldsDropDownContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityFieldsDropDownContainer);

export default VisibleEntityFieldsDropDownContainer;
