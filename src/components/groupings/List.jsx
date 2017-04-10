/**
 * Render the ui for Grouping Manager
 */
import React from 'react';
import log from '../../log';
import GroupingList from '../entitybrowser/item/GroupingList';

// Chamel Controls
import AppBar from 'chamel/lib/AppBar';
import GridContainer from 'chamel/lib/Grid/Container';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import ArrowBackIcon from 'chamel/lib/icons/font/ArrowBackIcon';
import AddIcon from 'chamel/lib/icons/font/AddIcon';

/**
 * Displays the ui for listing the catories
 */
class GroupList extends React.Component {

  /**
   * Define propTypes for this component
   */
  static propTypes = {
    /**
     * The collection of groupings that will be displayed as list
     *
     * @type {entity/Groupings}
     */
    groupings: React.PropTypes.object.isRequired,

    /**
     * Callback function that is called when adding a new group
     *
     * @type {func}
     */
    onAddGroup: React.PropTypes.func,

    /**
     * Callback function that is called when editing a new group
     *
     * @type {entity/Groupings}
     */
    onEditGroup: React.PropTypes.func,

    /**
     * Navigation back button - left arrow to the left of the title
     *
     * @type {func}
     */
    onNavBtnClick: React.PropTypes.func
  }

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
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

    let elementRight = (
      <IconButton
        key="add"
        onClick={this._handleAddGroup}>
        <AddIcon />
      </IconButton>
    );

    let groups = this.props.groupings.getGroupsHierarch();
    let groupList = this._buildGroupList(groups, [], 0);

    return (
      <div>
        <AppBar
          fixed={true}
          key="Save"
          title={"Manage Categories"}
          zDepth={0}
          iconElementRight={elementRight}
          iconElementLeft={elementLeft}
        />
        <GridContainer fluid>
          {groupList}
        </GridContainer>
      </div>
    )
  };

  /**
   * This function will build the groupList by looping thru the groups recursively
   *
   * @param {array} groups A collection of groups that is sorted by hierarchy
   * @param {array} groupList A list of GroupingList item that will be used to display the groupings
   * @param {int} opt_indent This will be used to indent the child group in the grouping
   * @private
   */
  _buildGroupList = (groups, groupList, opt_indent) => {

    let indent = opt_indent || 0;
    let nextindent = indent + 30;

    for (let idx in groups) {
      let group = groups[idx];

      groupList.push(
        <GroupingList
          key={group.id}
          onClick={this._handleEditGroup}
          group={group}
          indent={indent}
        />
      );

      // Recursively handle children
      if (group.children && group.children.length) {
        this._buildGroupList(group.children, groupList, nextindent);
      }
    }

    return groupList;
  };

  /**
   * Handle event where the user wants to add a new group.
   *
   * @param {DOMEvent} evt Reference to the DOM event being sent
   * @private
   */
  _handleAddGroup = (evt) => {
    if (this.props.onAddGroup) {
      this.props.onAddGroup();
    }
  };

  /**
   * Handle event where the user clicks a group row to edit.
   *
   * @param {entity/definition/Group} group The group that will be edited
   * @private
   */
  _handleEditGroup = (group) => {
    if (this.props.onEditGroup) {
      this.props.onEditGroup(group);
    }
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
  }
}

export default GroupList;
