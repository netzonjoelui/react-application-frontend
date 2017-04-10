/**
 * Main  view for entity comments
 */
import React from 'react';
import theme from './_entity-comments.scss';
import File from './fileattachment/File.jsx';
import FileAttachmentContainer from '../containers/FileAttachmentContainer';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import TextField from 'chamel/lib/Input/TextField';

// Chamel Icons
import SendIcon from 'chamel/lib/icons/font/SendIcon';


/**
 * Handle rendering comments browser inline and add comment
 */
class EntityComments extends React.Component {
  static propTypes = {

    /**
     * Callback function that is called when adding a new comment
     *
     * @type {function}
     */
    onAddComment: React.PropTypes.func,

    /**
     * Callback function that is called when attaching a file
     *
     * @type {function}
     */
    onAttachFile: React.PropTypes.func,

    /**
     * Callback function that is called when removing an attached file
     *
     * @type {function}
     */
    onRemoveFile: React.PropTypes.func,

    /**
     * The current device size
     *
     * @type {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * The files that are attached to the comment entity
     *
     * @type {array}
     */
    attachedFiles: React.PropTypes.array,
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      commBrowser: null
    }
  };

  componentDidMount() {
    //this._loadCommentsBrowser();
  };

  render() {

    let addCommentForm = null;

    addCommentForm = (
      <div className={theme.entityCommentsForm}>
        <div className={theme.entityCommentsFormLeft}>
          <FileAttachmentContainer
            attachmentLabel={""}
            onFileAttached={this.props.onAttachFile}
          />
        </div>
        <div className={theme.entityCommentsFormCenter}>
          <TextField
            ref="commInput"
            hintText="Add Comment"
            multiLine={true}
          />
        </div>
        <div className={theme.entityCommentsFormRight}>
          <IconButton
            onClick={this._handleCommentSend}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );

    let displayAttachedFiles = [];

    // Loop thru the attachedFiles and create the display for the file details using the File Component
    if (this.props.attachedFiles) {

      // Loop thru the attached files
      this.props.attachedFiles.forEach((file, idx) => {
        displayAttachedFiles.push(
          <File
            key={"attachedFile"+idx}
            index={idx.toString()}
            file={file}
            onRemove={this.props.onRemoveFile}
          />
        );
      });
    }

    return (
      <div>
        <div className={theme.entityComments}>
          <div ref="commCon"></div>
          {addCommentForm}
          {displayAttachedFiles}
        </div>
      </div>
    );
  };

  /**
   * Handle when a user hits send on the comment form
   *
   * @param {DOMEvent} evt
   * @private
   */
  _handleCommentSend = (evt) => {
    let value = this.refs.commInput.getValue();
    if (this.props.onAddComment) {
      this.props.onAddComment(value);
    }

    // Clear the form
    this.refs.commInput.setValue("");
  };
}

export default EntityComments;
