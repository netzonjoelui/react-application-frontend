/**
 * Image component
 */

import theme from './entity-form.scss';
import React from 'react';
import server from '../../../server';
import Controls from '../../Controls';
import PageModal from '../../PageModal';
import FileAttachmentContainer from '../../../containers/FileAttachmentContainer';

// Controls
const DropDownIcon = Controls.DropDownIcon;

/**
 * Image Element
 */
class Image extends React.Component {

  /**
   * Expected props
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
     * The label that will be used in image upload button
     *
     * @type {string}
     */
    label: React.PropTypes.string,

    /**
     * Change callback used once we set the image field id
     *
     * @type {function}
     */
    onChange: React.PropTypes.func.isRequired
  };

  /**
   * Set default values for props
   */
  static defaultProps = {
    label: 'Image'
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    this.state = {
      showImageUploader: false
    }
  }

  /**
   * Render the component
   */
  render () {
      let elementNode = this.props.elementNode;
      let fieldName = elementNode.getAttribute('name');
      let fieldValue = this.props.entity.getValue(fieldName);
      let imageSource = server.host + "/images/icons/objects/files/image_48.png";

      // Actions available for the image.
      let iconMenuItems = [
          {payload: 'upload', text: 'Upload File'},
          {payload: 'select', text: 'Select Uploaded File'}
      ];

      // If we have a field value, then lets display the image
      if (fieldValue) {
          imageSource = server.host + "/files/images/" + this.props.entity.getValue(fieldName) + "/48";
          // If there is a value saved, then let's display the remove action
          iconMenuItems.push({payload: 'remove', text: 'Remove File!'});
      }

      // Show dialog to display image uploader
      let displayImageUploaderDialog = null;
      if (this.state.showImageUploader === true) {
        displayImageUploaderDialog = (
          <PageModal
            deviceSize={this.props.deviceSize}
            title={"Upload image"}
            onCancel={this._handleImageUploaderCancel}
            onContinue={null}>

            <FileAttachmentContainer
                allowMultipleSelect={false}
                attachmentLabel={"Select File"}
                onFileAttached={this._handleSelectedFileChanged}
                />
          </PageModal>
        );
      }

      return (
          <div>
              <div>
                  <DropDownIcon
                    iconClassName="fa fa-pencil-square-o"
                    menuItems={iconMenuItems}
                    onChange={this._handleSelectMenuItem}>
                      <img
                          src={imageSource}
                          style={{width: "48px", height: "48px", cursor: "pointer"}}
                          title={"Change " + this.props.label}
                      />
                  </DropDownIcon>
              </div>



              {displayImageUploaderDialog}
          </div>
      );
  }

  /**
   * Callback used to handle commands when user selects an action from the menu
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @param {int} key The index of the menu clicked
   * @param {Object} data The object value of the menu clicked
   * @private
   */
  _handleSelectMenuItem = (e, key, data) => {
      switch (data.payload) {
          case 'upload':
              this._handleImageUploadClick();
              break;
          case 'select':
              this._handleImageSelect();
              break;
          case 'remove':
              this._handleRemoveImage();
              break;
      }
  };

  /**
   * Handles the image uploader cancel button
   *
   * @private
   */
  _handleImageUploaderCancel = () => {
    this.setState({
      showImageUploader: false
    });
  };

  /**
   * Handles the file attached to the image component
   *
   * @param {object} fileList Contains the list of files selected with the <input type="file"> element
   * @param {string} uploadingProcessId unique hash for every file upload process
   * @param {int} folderId This will determine where to upload the files.
   * @param {string} folderPath The path of the folder where we will upload the file
   * @private
   */
  _handleSelectedFileChanged = (fileList, uploadingProcessId, folderId, folderPath) => {
      this._handleImageUploaded(fileList);
  };

  /**
   * Handles the image upload dialog to show
   *
   * @private
   */
  _handleImageUploadClick = () => {

    this.setState({
      showImageUploader: true
    });

  };

  /**
   * Saves the imageId and imageName of the uploaded file to the entity field
   *
   * @param {File} image Instance of the file model
   *
   * @private
   */
  _handleImageUploaded = (image) => {
    let elementNode = this.props.elementNode;
    let fieldName = elementNode.getAttribute('name');

    // Set the image in the entity object
    this.props.entity.setValue(fieldName, image.id, image.name);

    // Let the parent container know we have changed a value
    this.props.onChange(this.props.entity.getData());
  };

  /**
   * Function that will open an object browser and let the user select an uploaded image
   *
   * @private
   */
  _handleImageSelect = () => {
    let elementNode = this.props.elementNode;
    let fieldName = elementNode.getAttribute('name');
    let field = this.props.entity.def.getField(fieldName);

    // Make sure the field is an object, otherwise fail
    if (field.type != field.types.object && field.subtype) {
      throw "Field " + field.name + " is not an object/entity reference";
    }
  };

  /**
   * Remove the image selected by clearing the value of the entity field
   *
   * @private
   */
  _handleRemoveImage = () => {
    let elementNode = this.props.elementNode;
    let fieldName = elementNode.getAttribute('name');

    // Set the entity field value to null
    this.props.entity.setValue(fieldName, null);
    this.props.onChange(this.props.entity.getData());
  };
}

export default Image;
