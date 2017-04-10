/**
 * Attachments
 *
 */
import React from 'react';
import theme from './entity-form.scss';
import File from '../../fileattachment/File.jsx';
import FileAttachmentContainer from '../../../containers/FileAttachmentContainer.jsx';

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';

/**
 * Base level element to represent an attachment field in an entity form
 */
class Attachments extends React.Component {

  /**
   * Define propTypes that this component
   */
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
    editMode: React.PropTypes.bool,

    /**
     * Callback function that is called when adding or removing a file
     *
     * @type {func}
     */
    onChange: React.PropTypes.func
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
  };

  render() {

    const fileAttachments = this.props.entity.getAttachments();
    let displayAttachedFiles = [];

    // Check if we have attached files
    if (fileAttachments) {

      // Loop thru the attached files
      fileAttachments.forEach((file, idx) => {
        displayAttachedFiles.push(
          <File
            key={"attachedFile"+idx}
            index={idx.toString()}
            file={file}
            onRemove={this._handleRemoveFile}
          />
        );
      });
    }

    return (
      <div>
        <GridContainer fluid>
          <FileAttachmentContainer
            onFileAttached={this._handleAttachFile}
          />
          {displayAttachedFiles}
        </GridContainer>
      </div>
    );
  };

  /**
   * Saves the fileId and fileName of the attached file to the entity field 'attachments'
   *
   * @param {File} file Instance of the file model
   * @private
   */
  _handleAttachFile = (file) => {

    // Add the file in the entity object
    this.props.entity.addMultiValue('attachments', file.id, file.name);
    this.props.onChange(this.props.entity.getData());
  };

  /**
   * Removes the file uploaded in the entity object
   *
   * @param {File} file The file that will be removed
   * @private
   */
  _handleRemoveFile = (file) => {

    // Remove the file from the entity object
    this.props.entity.remMultiValue('attachments', file.id);
    this.props.onChange(this.props.entity.getData());
  };
}

export default Attachments;
