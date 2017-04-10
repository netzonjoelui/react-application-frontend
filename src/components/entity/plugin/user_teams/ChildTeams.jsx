import React from 'react';
import loader from '../../../../models/entity/entityLoader';
import GroupingChip from '../../GroupingChip.jsx';
import CustomEventTrigger from '../../../mixins/CustomEventTrigger.jsx';
import EntityCollection from '../../../../models/entity/Collection';

// Chamel Controls
import Snackbar from 'chamel/lib/Snackbar/Snackbar';

// Chamel Icons
import AddCircleIcon from 'chamel/lib/icons/font/AddCircleIcon';

/**
 * Manage action data for setting of child teams
 */
var ChildTeams = React.createClass({

  mixins: [CustomEventTrigger],

  /**
   * Expected props
   */
  propTypes: {
    /**
     * Entity being edited
     *
     * @type {entity/Entity}
     */
    entity: React.PropTypes.object,

    /**
     * Generic object used to pass events back up to controller
     *
     * @type {Object}
     */
    eventsObj: React.PropTypes.object,

    /**
     * Flag indicating if we are in edit mode or view mode
     *
     * @type {bool}
     */
    editMode: React.PropTypes.bool,

    /**
     * The parent id of the team
     *
     * @type {int}
     */
    parent_id: React.PropTypes.number,

    /**
     * If the team has a parent id, then it should have a parent name
     *
     * @type {string}
     */
    parent_id_fval: React.PropTypes.string
  },

  componentDidMount: function () {
    this.loadChildTeams();
  },

  getInitialState: function () {
    // Return the initial state
    return {
        entityCollection: null,
        teams: []
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.loadChildTeams();
  },

  /**
   * Render action type form
   *
   * @returns {JSX}
   */
  render: function () {
    let parentTeam,
        childTeam,
        parentName = null;

    // If we have a parent id, then let's display the parent name details
    if (this.props.entity.getValue("parent_id") > 0) {
      parentName = this.props.entity.getValueName("parent_id");

      // If parent value name is empty, let's try to get it from the parent's entity
      if (!parentName) {
        let parentEntity = loader.get(this.props.entity.objType, this.props.entity.getValue("parent_id"));
        parentName = parentEntity.getValue("name");
      }

      parentTeam = (
        <div>
          <div className="entity-form-field-label">
            {"Parent Name"}
          </div>
          <div className="entity-form-field">
            {parentName}
          </div>
        </div>
      );
    }

    // If we are creating new team and there is no entity id yet, then we do not need to display the child team for now
    if (this.props.entity.id) {
      childTeam = (
        <div>
          <div className="entity-form-field-label">
            {"Child Teams"}
          </div>
          <div className="entity-form-field">
            {this.state.teams}
            <IconButton
              key="add"
              tooltip="Add Child Team"
              onClick={this._handleAddingChildTeam}>
              <AddCircleIcon />
            </IconButton>
          </div>
        </div>
      );
    }

    return (
      <div className="entity-form-field">
          {parentTeam}
          {childTeam}
          <Snackbar ref="snackbar" message={this.state.snackbarMessage}/>
      </div>
    );
  },

  /**
   * Load the child teams of this team entity
   *
   * @private
   */
  loadChildTeams: function () {
    // If we have no entity id, then no need to get the child teams
    if (!this.props.entity.id) {
      return;
    }

    if (!this.state.entityCollection) {
      this.state.entityCollection = new EntityCollection(this.props.entity.objType);

      /**
       * Force the entity collection to only have one backend request
       * This will enable us to abort other requests that are in-progress
       */
      this.state.entityCollection.forceOneBackendRequest();
    }

    this.state.entityCollection.clearConditions();
    this.state.entityCollection.where("parent_id").equalTo(this.props.entity.id);

    let collectionDoneCallback = function () {
      let teams = [];
      let entities = this.state.entityCollection.getEntities();

      // Map thru the entities result and create a grouping chip for child teams
      entities.map(function (entity, idx) {
        teams.push(
          <GroupingChip
            key={idx}
            id={parseInt(entity.id)}
            name={entity.getValue("name")}
            onRemove={this._handleRemove}
            onClick={function (){
              this.triggerCustomEvent("entityclick", {objType: entity.objType, id: entity.id});
            }.bind(this)}
          />
        );
      }.bind(this));

      this.setState({teams: teams});
    }.bind(this);

    this.state.entityCollection.load(collectionDoneCallback);
  },

  /**
   * Handles the adding of child team
   *
   * @private
   */
  _handleAddingChildTeam: function () {
    let refField = this.props.elementNode.getAttribute('ref_field');
    let params = [];

    // Setup the parameters needed on creating a new team.
    params[refField] = this.props.entity.id;
    params[refField + '_fval'] = encodeURIComponent(this.props.entity.getValue("name"));

    this.triggerCustomEvent("entitycreatenew", {objType: this.props.entity.objType, params: params});
  },

  /**
   * Handle removing value from the team in the entity
   *
   * @param {string} id The unique id of the grouping to remove
   * @param {string} name Optional name value of the id
   *
   * @private
   */
  _handleRemove: function (id, name) {
    throw 'Entities should only be deleted within a container, not a component';
    // TODO: We might want to make this a container so it can interact with the store
    //saver.remove(this.props.entity.objType, [id], this.loadChildTeams);
  }
});

export default ChildTeams;
