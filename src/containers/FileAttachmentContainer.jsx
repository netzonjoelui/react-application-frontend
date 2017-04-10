import React from 'react';
import createHash from 'sha.js';
import { connect } from 'react-redux';
import { uploadFiles } from '../actions/files';
import { deviceSizes } from '../models/device';
import FileAttachmentComponent from '../components/FileAttachment.jsx';
import FileModel from '../models/entity/fileattachment/File';
import log from '../log';

// Chamel Controls
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

// Chamel Icons
import IconButton from 'chamel/lib/Button/IconButton';

/**
 * Main application class for File Upload
 */
class FileAttachmentContainer extends React.Component {

  /**
   * Define propTypes that this component
   */
  static propTypes = {

    /**
     * Callback function that is called when uploading a file
     *
     * @var {func}
     */
    onUploadedFiles: React.PropTypes.func.isRequired,

    /**
     * Callback function that is called when a file is attached
     *
     * @var {func}
     */
    onFileAttached: React.PropTypes.func,

    /**
     * The current device size
     *
     * @var {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * Label that will be displayed at the right side of the attach icon
     *
     * @var {String}
     */
    attachmentLabel: React.PropTypes.string,

    /**
     * Flag that will determine if we will allow the selecting of multiple files
     *
     * @var {bool}
     */
    allowMultipleSelect: React.PropTypes.bool
  };

  /**
   * Set default values
   */
  static defaultProps = {
    fileAttachments: []
  };

  /**
   * Class constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      uploadingProcessId: null,
      uploadingProcessError: null
    };
  };

  /**
   * Handle incoming new props
   */
  componentWillReceiveProps(nextProps) {


    // Check if there is already a result from our upload process by using the state.uploadingProcessId
    if (nextProps.uploadedFiles[this.state.uploadingProcessId]) {

      // Get the result of the uploaded files
      let uploadedFiles = nextProps.uploadedFiles[this.state.uploadingProcessId];

      // If there is no error while uploading the files, then we will now process each files
      if (!uploadedFiles.error) {

        // Loop thru the uploaded files and create an instance of FileModel for each file
        for (let idx in uploadedFiles) {
          let uploadedFile = new FileModel(uploadedFiles[idx]);

          // Call the props.onFileUploaded for additional functions to be executed
          if (this.props.onFileAttached) {
            this.props.onFileAttached(uploadedFile)
          }
        }

        // Once we have the result of the uploaded files, then we can now clear the uploadingProcessingId
        this.setState({
          uploadingProcessId: null,
        });
      } else {

        // If there is an error while uploading the files, then we will display the error

        // Clear the uploadingProcessId since we are done uploading the files
        this.setState({
          uploadingProcessId: null,
          uploadingProcessError: "Error while uploading the files. " + uploadedFiles.error
        });
      }
    }
  }

  /**
   * Render the applicatoin
   *
   * @returns {Object}
   */
  render() {
    return (
      <div>
        <FileAttachmentComponent
          onSelectFile={this.handleUploadFile}
          attachmentError={this.state.uploadingProcessError}
          attachmentLabel={this.props.attachmentLabel}
          clearSelectedFiles={(this.state.uploadingProcessId) ? false : true}
          allowMultipleSelect={this.props.allowMultipleSelect}
        />
      </div>
    );
  };

  /**
   * Handles the hiding of file upload component
   */
  handleHideFileUpload = () => {
    this.setState({showFileUpload: false});
  };

  /**
   * Handles the uploading of files.
   *
   * @param {object} fileList Contains the list of files selected with the <input type="file"> element
   * @param {int} folderId This will determine where to upload the files.
   * @param {string} folderPath The path of the folder where we will upload the file
   */
  handleUploadFile = (fileList, folderId, folderPath) => {

    /*
     * We will create a unique hash for every file upload process.
     * This unique hash will be used in the ::componentWillReceiveProps() to check if the file(s)
     *  were successfully uploaded
     */
    let uploadingProcessId = this.createUploadProcessHash(folderPath + "-" + "folderId");

    // Upload the file to the server
    this.props.onUploadedFiles(fileList, uploadingProcessId, folderId, folderPath);

    // update the state with our current uploadingProcessId
    this.setState({uploadingProcessId});
  };

  /**
   * Compute a unique hash based on the file that is being uploaded.
   *
   * @param {string} message The initial message where we will create the hash
   * @return {string} hash for this file upload process
   */
  createUploadProcessHash = (message) => {

    message += Date.now();

    // Create a sha256 hash
    let sha256 = createHash('sha256');
    message = sha256.update(message, 'utf8').digest('hex');

    // Concat the hash length to keep it under 16 chars
    if (message.length > 16) {
      message = message.substr(0, 16);
    }

    return message;
  };
}

/**
 * Map properties in the application store state to module properties
 *
 * @param {Object} state The current application state
 * @param {Object} ownProps Properties that were passed to this component
 * @returns {Object}
 */
const mapStateToProps = (state, ownProps) => {

  return {
    deviceSize: state.device.size,
    uploadedFiles: state.files.uploadedFiles
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
    onUploadedFiles: (fileList, uploadingProcessId, folderId, folderPath) => {
      // Upload files to the server
      dispatch(uploadFiles(fileList, uploadingProcessId, folderId, folderPath));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileAttachmentContainer);
