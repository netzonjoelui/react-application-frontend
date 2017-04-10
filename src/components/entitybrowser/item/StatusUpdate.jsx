/**
 * List Item used where object type is 'status_update'
 */
import theme from './_activity.scss';
import React from 'react';
import UserProfileImage from '../../UserProfileImage.jsx';

/**
 * List item for an StatusUpdate
 */
class StatusUpdateItem extends React.Component {
  static propTypes = {
    /**
     * The entity that is being worked on
     */
    entity: React.PropTypes.object,

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
    const timestamp = entity.getTime(null, true);
    const ownerId = entity.getValue('owner_id');
    const ownerName = entity.getValueName('owner_id', ownerId);
    const notes = this._processNotes(entity.getValue('comment'));
    const objReference = entity.getValue('obj_reference');
    let objectLinkReference = null;

    // Check if this status update has object reference, then we will set the entity onclick
    if (objReference) {

      // Get the object type of this status update
      let objType = objReference.split(':')[0];
      objType = objType[0].toUpperCase() + objType.slice(1);

      objectLinkReference = (
        <div>
          {objType}: <a href='javascript: void(0);'
                        onClick={this._handleObjReferenceClick}>{entity.getValueName('obj_reference', objReference)}</a>
        </div>
      );
    }

    return (
      <div className={theme.entityBrowserActivity}>
        <div className={theme.entityBrowserActivityImg}>
          <UserProfileImage width={32} userId={ownerId}/>
        </div>
        <div className={theme.entityBrowserActivityDetails}>
          <div className={theme.entityBrowserActivityHeader}>
            {ownerName}
            {objectLinkReference}
          </div>
          <div className={theme.entityBrowserActivityBody}>
            <div dangerouslySetInnerHTML={notes}/>
          </div>
          <div className={theme.entityBrowserActivityTitle}>
            {timestamp}
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
      let re = new RegExp('\n', 'gi');
      val = val.replace(re, '<br />');
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
   * Handles the clicking of object reference link
   *
   * @private
   */
  _handleObjReferenceClick = () => {
    if (this.props.onEntityListClick) {
      this.props.onEntityListClick('status_update', this.props.entity.id);
    }
  };
}

export default StatusUpdateItem;
