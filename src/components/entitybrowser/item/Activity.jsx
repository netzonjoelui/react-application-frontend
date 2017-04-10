/**
 * List Item used where object type is 'activity'
 */
import theme from './_activity.scss';
import React from 'react';
import Chamel from 'chamel';
import UserProfileImage from '../../UserProfileImage';
import File from '../../fileattachment/File';

/**
 * List item for an activity
 */
class ActivityItem extends React.Component {
  static propTypes = {
    /**
     * The entity that is being worked on
     */
    entity: React.PropTypes.object,

    /**
     * The filters used to display this activity list item
     */
    filters: React.PropTypes.array,

    /**
     * Function that will handle the clicking of object reference link
     */
    onEntityListClick: React.PropTypes.func
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  };

  shouldComponentUpdate(nextProps, nextState) {

    // If we do not have any changes in the nextProps, then we will not proceed with re-rendering the component
    if (this.props.entity.getValue("revision") == nextProps.entity.getValue("revision")) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const entity = this.props.entity;
    const headerTime = entity.getTime(null, true);
    const userId = entity.getValue('user_id');
    const userName = entity.getValueName('user_id', userId);
    const activity = this._getActivityDetails();

    // Get the attached files
    const files = entity.getAttachments();
    let attachedFiles = [];
    for (let idx in files) {
      let file = files[idx];

      // Check if file is an image
      attachedFiles.push(
        <File
          key={idx}
          index={idx}
          file={file}
        />
      );
    }

    let displayNotes = null;

    if (activity.notes) {
      displayNotes = (
        <div dangerouslySetInnerHTML={this._processNotes(activity.notes)}/>
      )
    }

    let activityName = activity.name;

    // Check if this activity has object reference, then we will set the entity onclick
    if (activity.objectLinkReference) {
      activityName = (<a href='javascript: void(0);'
                         onClick={this._handleObjReferenceClick.bind(this, activity.objReference, activity.name)}>{activity.name}</a>);
    }

    return (
      <div className={theme.entityBrowserActivity}>
        <div className={theme.entityBrowserActivityImg}>
          <UserProfileImage width={32} userId={userId}/>
        </div>
        <div className={theme.entityBrowserActivityDetails}>
          <div className={theme.entityBrowserActivityHeader}>
            {headerTime}
          </div>
          <div className={theme.entityBrowserActivityTitle}>
            {userName} {activity.description} {activityName}

          </div>
          <div className={theme.entityBrowserActivityBody}>
            {displayNotes}
            {attachedFiles}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render text to HTML for viewing
   *
   * @param {string} val The value to process
   */
  _processNotes = (val) => {

    // Convert new lines to line breaks
    if (val) {
      const regularExperssion = new RegExp('\n', 'gi');
      val = val.replace(regularExperssion, '<br />');
    }

    // Convert email addresses into mailto links?
    //fieldValue = this._activateLinks(fieldValue);

    /*
     * TODO: Make sanitized html object. React requires this because
     * setting innherHTML is a pretty dangerous option in that it
     * is often used for cross script exploits.
     */
    return (val) ? {__html: val} : null;
  };

  /**
   * Get the activity details of the entity
   *
   * @return {object}
   */
  _getActivityDetails = () => {

    const entity = this.props.entity;
    const direction = entity.getValue('direction');
    const typeId = entity.getValue('type_id');
    const activityType = entity.getValueName('type_id', typeId);

    // Create the activity object with a name index
    let activity = {
      name: entity.getValue('name'),
      notes: entity.getValue('notes'),
      objReference: entity.getValue('obj_reference'),
      objectLinkReference: this._getObjLinkReference()
    };

    switch (activityType.toLowerCase()) {
      case 'email':
        if (direction === 'i') {
          activity.description = 'received an email ';
        } else {
          activity.description = 'sent an email ';
        }

        break;
      case 'phone call':
        if (direction === 'i') {
          activity.description = 'logged an innbound call ';
        } else {
          activity.description = 'logged an outbound call ';
        }
      case 'comment':
        activity.description = 'commented on ';

        break;
      case 'status update':
        activity.description = 'added a ';
        activity.name = activityType;

        break;
      default:
        let verb = entity.getValue('verb');
        if (verb == 'create' || verb == 'created') {
          activity.description = 'created a new ' + activityType + ' ';
        } else {
          activity.description = verb + ' ';
        }

        activity.notes = null;

        break;
    }

    return activity;
  };

  /**
   * Get the object reference for a link
   *
   * Each activity has a reference to an object the activity was performed on.
   * If this browser has been filtered by one specific object, it can be assumed
   * that the calling code already knows about the obj_reference in question
   * and we do not need to display the link. A good example of this is in an
   * activity component for an entity form. The user is already viewing a specific
   * task so there is no need to add a link to that same talk in all activities.
   *
   * @private
   * @return {string} Object reference that should be linked to
   */
  _getObjLinkReference = () => {
    const entity = this.props.entity;
    const filters = this.props.filters || null;
    let objReference = entity.getValue('obj_reference') || null;

    // We do not need to check if ther is no filters or objReference set
    if (filters && objReference) {

      // Loop thru the filters passed from the props
      for (let idx in filters) {
        let value = filters[idx]['value'];
        let fieldName = filters[idx]['fieldName'];

        /**
         * If the filter value from obj_reference or associations is the same as the activity's objReference
         * Then we need to set the object reference to null.
         * Because this activity's objReference is the same entity we are currently viewing
         */
        if (value == objReference && (fieldName == 'obj_reference' || fieldName == 'associations')) {
          objReference = null;
        }
      }
    }

    return objReference;
  };

  /**
   * Handles the clicking of object reference link
   *
   * @param {string objType:eid} objReference The object reference of this activity
   * @param {string} title Title of the object reference
   * @private
   */
  _handleObjReferenceClick = (objReference, title) => {
    let parts = objReference.split(':');
    const objType = parts[0];
    const eid = parts[1] || null;

    if (this.props.onEntityListClick) {
      this.props.onEntityListClick(objType, eid, title);
    }
  };
}

export default ActivityItem;
