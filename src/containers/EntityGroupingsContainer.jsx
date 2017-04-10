import React from 'react';
import { connect } from 'react-redux';
import { fetchGroupings, saveGroup } from '../actions/groupings';
import ListGroupComponent from '../components/groupings/List.jsx';
import ManageGroupComponent from '../components/groupings/Manage.jsx';
import EntityGroupings from '../models/entity/Groupings';
import Group from '../models/entity/definition/Group';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

/**
 * Container class for Advanced Search
 */
class EntityGroupingsContainer extends React.Component {

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
     * The data that will be used to create an instance of entity/Groupings
     *
     * @type {object}
     */
    groupingsData: React.PropTypes.object.isRequired,

    /**
     * Callback function that is called to fetch the groupings from the server
     *
     * @type {func}
     */
    onFetchGroupings: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called to save a group to the server
     *
     * @type {string}
     */
    onSaveGroup: React.PropTypes.func.isRequired
  };

  /**
   * Set some sane defaults
   */
  static defaultProps = {
    groupingsData: null
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      group: null,
      showManageGroup: false,
    }
  };

  /**
   * Entered the DOM
   */
  componentDidMount() {
    if (this.props.groupingsData === null) {
      // If the groupingsData is not provided, then we will fetch the groupings
      this.props.onFetchGroupings(this.props.objType, this.props.fieldName);
    }
  };

  /**
   * Render the advanced search container
   *
   * @returns {Object}
   */
  render() {

    // If groupingData is not yet ready, then we need to display the loading progress bar
    if (!this.props.groupingsData) {
      return (
        <div>
          <LinearProgress
            mode={"indeterminate"}
          />
          <div>Loading...</div>
        </div>
      );
    }

    let groupings = new EntityGroupings(this.props.objType, this.props.fieldName, this.props.groupingsData.filter)

    groupings.fromArray(this.props.groupingsData);

    // If showManageGroup is set, and there is a state.group, then we will show the grouping manager
    if (this.state.showManageGroup && this.state.group) {
      return (
        <ManageGroupComponent
          groupings={groupings}
          group={this.state.group}
          onSave={this.handleSaveGroup}
          onNavBtnClick={this.handleClose}
        />
      )
    } else {
      return (
        <ListGroupComponent
          groupings={groupings}
          onAddGroup={this.handleAddGroup}
          onEditGroup={this.handleEditGroup}
          onNavBtnClick={this.handleClose}
        />
      );
    }
  };

  /**
   * Handles the saving the changes made to the group
   *
   * @param {string} action This will determine what type of action we will be executing.
   *                        Expected values are (add, edit, delete)
   * @param {entity/Groupings} groupings The groupings where we will save the group definition
   * @param {entity/definition/Group} group The group definition that will be saved
   */
  handleSaveGroup = (action, groupings, group) => {
    this.props.onSaveGroup(action, groupings, group)
  }

  /**
   * Handles the adding of new group
   */
  handleAddGroup = () => {
    let group = new Group();

    this.setState({
      group: group,
      showManageGroup: true
    });
  };

  /**
   * Handles the editing of the existing group
   *
   * @param {entity/definition/Group} group The group that will be edited
   */
  handleEditGroup = (group) => {
    this.setState({
      group: group,
      showManageGroup: true
    });
  };

  /**
   * Handles the back button navigation click
   */
  handleClose = () => {
    this.setState({
      group: null,
      showManageGroup: false
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
  const groupingsData = state.groupings[ownProps.objType] || null;

  return {
    groupingsData: groupingsData
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
    onFetchGroupings: (objType, fieldName, opt_filter) => {
      // Get the entity definition from the server
      dispatch(fetchGroupings(objType, fieldName, opt_filter));
    },

    onSaveGroup: (action, groupings, group) => {
      // Save the group to the server
      dispatch(saveGroup(action, groupings, group));
    },
  }
};

// Connect this container to listen to redux
const VisibleGroupingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGroupingsContainer);

export default VisibleGroupingsContainer;
