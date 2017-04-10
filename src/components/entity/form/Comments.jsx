/**
 * Component that handles rendering both an add comment form and comments list into an entity form
 */
import React from 'react';
import CommentsContainer from '../../../containers/CommentsContainer';
import { deviceSizes } from '../../../models/device';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import FlatButton from 'chamel/lib/Button/FlatButton';

// Chamel Icons
import CommentIcon from 'chamel/lib/icons/font/CommentIcon';

/**
 * Constant indicating the smallest device that we can print comments in
 *
 * All other devices will open comments in a dialog when clicked
 *
 * @type {number}
 * @private
 */
var _minimumInlineDeviceSize = deviceSizes.large;

/**
 * Render comments into an entity form
 */
class Comments extends React.Component {

  static propTypes = {

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
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      numComments: this.props.entity.getValue('num_comments'),
      entityId: this.props.entity.id
    }
  }

  render() {

    let numComments = 0
    if (this.props.entity.getValue("num_comments")) {
      numComments = this.props.entity.getValue("num_comments");
    }

    if (this.props.entity.id) {
      return (
        <CommentsContainer
          referencedObjType={this.props.entity.objType}
          referencedEntityId={this.props.entity.id}
          existingCommentsCount={numComments.toString()}
        />
      );
    } else {
      return (<div>{"0 Comments"}</div>);
    }
  }

}

export default Comments;
