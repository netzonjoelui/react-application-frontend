/**
 * Render the file attachment component
 */

import React from 'react';
import ReactDOM from 'react-dom';
import theme from './fileattachment/_file.scss';
import File from './fileattachment/File.jsx';
import FileModel from '../models/entity/fileattachment/File'

// Chamel Controls
import GridContainer from 'chamel/lib/Grid/Container';
import FlatButton from 'chamel/lib/Button/FlatButton';
import IconButton from 'chamel/lib/Button/IconButton';

// Chamel Icons
import AttachFileIcon from 'chamel/lib/icons/font/AttachFileIcon';

/**
 * Displays file attachment controls that will allow the user to attach files
 */
class FileAttachment extends React.Component {
  static propTypes = {

    /**
     * Callback function that is called when files are selected
     *
     * @var {func}
     */
    onSelectFile: React.PropTypes.func,

    /**
     * The current device size
     *
     * @var {int}
     */
    deviceSize: React.PropTypes.number,

    /**
     * Flag that will determine if we will allow the selecting of multiple files
     *
     * @var {bool}
     */
    allowMultipleSelect: React.PropTypes.bool,

    /**
     * Flag that will make sure that the selectedFiles are cleared. This is essential when attaching new batch of files
     * Or files were successfully attached
     *
     * @var {bool}
     */
    clearSelectedFiles: React.PropTypes.bool,

    /**
     * An error that is thrown when attaching a file
     *
     * @var {String}
     */
    attachmentError: React.PropTypes.string,

    /**
     * Label that will be displayed at the right side of the attach icon
     *
     * @var {String}
     */
    attachmentLabel: React.PropTypes.string
  };

  /**
   * Set default values
   */
  static defaultProps = {
    attachmentLabel: "Attach File(s)",
    allowMultipleSelect: true,
    clearSelectedFiles: false,
    folderId: null,
    currentPath: '%tmp%'
  };

  /**
   * Class constructorgoing
   *
   * @param props
   */
  constructor(props) {
    super(props)

    this.state = {
      selectedFileList: []
    }
  };

  /**
   * Handle incoming new props
   */
  componentWillReceiveProps(nextProps) {

    /*
     * If the new props recieved will not display the progress for the selected files
     * Then we will clear the state.selectedFileList since we do not need it anymore.
     */
    if (nextProps.clearSelectedFiles) {
      this.setState({
        selectedFileList: []
      });
    }
  }

  render() {

    let diplaySelectedFileList = [],
      displayAttachedFiles = [];

    let selectedFileList = this.state.selectedFileList;

    // Loop thru the selected files
    for (let idx in selectedFileList) {

      if (selectedFileList[idx] instanceof Blob) {

        // Create a new instance of File Model
        let file = new FileModel({
          name: selectedFileList[idx].name
        });

        diplaySelectedFileList.push(
          <File
            key={"selectedFile"+idx}
            index={idx.toString()}
            file={file}
            displayProgress={true}
          />
        );
      }
    }

    let multiple = null;
    if (this.props.allowMultipleSelect) {
      multiple = "multiple";
    }

    return (
      <div>
        <GridContainer fluid>
          <IconButton
            onClick={this.handleShowSelectFile}>
            <AttachFileIcon />
          </IconButton>
          {this.props.attachmentLabel}
          <div>
            <input
              type='file'
              ref='inputFile'
              onChange={this.handleSelectFile}
              multiple={multiple}
              style={{display: 'none'}}/>
          </div>
          <div className={theme.fileAttachmentError}>
            {this.props.attachmentError}
          </div>
          <div>
            {diplaySelectedFileList}
          </div>
        </GridContainer>
      </div>
    )
  };

  /**
   * Handles the showing of Input File select html element
   *
   */
  handleShowSelectFile = () => {
    ReactDOM.findDOMNode(this.refs.inputFile).click();
  };

  /**
   * Handles the selecting of files
   *
   * @param {DOMEvent} e Reference to the DOM event being sent
   * @private
   */
  handleSelectFile = (e) => {
    // Update the selectedFileList state with the new selected Files
    this.setState({
      selectedFileList: e.target.files
    });

    if (this.props.onSelectFile) {
      this.props.onSelectFile(e.target.files, this.props.folderId, this.props.currentPath);
    }

    e.preventDefault()
  };
}

export default FileAttachment;
