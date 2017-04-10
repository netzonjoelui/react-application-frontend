import React from 'react';
import EntityBrowserContainer from '../../../containers/EntityBrowserContainer';
import CustomEventTrigger from '../../mixins/CustomEventTrigger.jsx';
import Where from '../../../models/entity/Where';

// Chamel Controls
import DropDownMenu from 'chamel/lib/Picker/SelectField';

/**
 * Render Activity into an entity form
 */
let Activity = React.createClass({

  mixins: [CustomEventTrigger],

  propTypes: {
    /**
     * Current element node level
     *
     * @type {entity/form/FormNode}
     */
    elementNode: React.PropTypes.object.isRequired,

    /**
     * Entity being edited
     *
     * @type {entity/Entity}
     */
    entity: React.PropTypes.object,

    /**
     * Flag indicating if we are in edit mode or view mode
     *
     * @type {bool}
     */
    editMode: React.PropTypes.bool
  },

  getInitialState: function () {
    // Return the initial state
    return {
      viewMenuData: null,
      browser: null
    };
  },

  componentDidMount: function () {
    //this._loadActivities();
  },

  render: function () {
    let viewDropdownDisplay = null;

    if (this.state.viewMenuData) {
      viewDropdownDisplay = (
        <DropDownMenu
          menuItems={this.state.viewMenuData}
          selectedIndex={0}
          onChange={this._handleFilterChange}
        />
      );
    }

    // Add filter to only show activities from the referenced object
    let filter = new Where('associations');
    filter.equalTo(this.props.entity.objType + ":" + this.props.entity.id);

    return (
      <div>
        {viewDropdownDisplay}

        <EntityBrowserContainer
          mode={"inline"}
          conditions={[filter]}
          objType={"activity"}
          hideToolbar={true}
        />
      </div>
    );
  },

  /**
   * Callback used to handle the changing of filter dropdown
   *
   * @param {DOMEvent} e          Reference to the DOM event being sent
   * @param {int} key             The index of the menu clicked
   * @param {array} menuItem      The object value of the menu clicked
   * @private
   */
  _handleFilterChange: function (e, key, menuItem) {
    //this._loadActivities(menuItem.conditions)
  },

  /**
   * Set the activity view menu data in the state
   *
   * @param {array} activityViews     The activity view data from entity definition
   * @private
   */
  _setViewMenuData: function (activityViews) {
    let viewMenu = [];

    for (let idx in activityViews) {
      let view = activityViews[idx];

      viewMenu.push({
        text: view.name,
        conditions: view.getConditions()
      });
    }

    this.setState({viewMenuData: viewMenu});
  },

  /**
   * Trigger a custom event to send back to the entity controller
   *
   * @param {string} objType      The object type of the entity we are loading
   * @param {int} oid             The entity id we are loading
   * @private
   */
  _sendEntityClickEvent: function (objType, oid) {
    this.triggerCustomEvent("entityclick", {objType: objType, id: oid});
  }
});

export default Activity;
