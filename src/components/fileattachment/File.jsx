/**
 * Displays the info and actions for the uploaded files
 * Pass the file entity (entity/fileattachment/file) in the file props to display the file details
 * File Upload Progressbar will be displayed if file.progress is specified
 */

import React from 'react';
import theme from './_file.scss';
import classnames from 'classnames';
import server from '../../server';
import FileModel from '../../models/entity/fileattachment/File';

// Chamel Controls
import IconButton from 'chamel/lib/Button/IconButton';
import LinearProgress from 'chamel/lib/Progress/LinearProgress';

// Chamel Icons
import DeleteIcon from 'chamel/lib/icons/font/DeleteIcon';

const File = (props) => {
  let statusClass = theme.fileUploadStatus;
  let status = null;
  let displayRemoveBtn = null;
  let displayProgress = null;
  let percentComplete = null;
  let fileView = null;
  let file = props.file;

  // Check if we have progress event
  if (props.displayProgress) {
    let progress = props.file.progress;

    if (progress.errorText) {
      status = progress.errorText;
      statusClass = theme.fileUploadStatusError;
    } else if (progress.progressCompleted == 100) {
      status = 'Completed - ';
    } else if (progress.progressCompleted > 0 && progress.progressCompleted < 100) {
      status = 'Uploading - ' + progress.progressCompleted + '%';
      displayProgress = (
        <LinearProgress
          mode="determinate"
          min={0}
          max={progress.total}
          value={progress.uploaded}
        />
      );
    } else if (!file.id) {
      status = 'Uploading';
      displayProgress = <LinearProgress mode="indeterminate"/>;
    }
  }

  // If file preview url is available then lets display it.
  if (props.file.getFileUrl()) {
    fileView = <a href={props.file.getFileUrl()} target='_blank'>View File</a>;
  }

  // Check if we have a remove function set in the props
  if (props.onRemove) {
    displayRemoveBtn = (
      <IconButton
        onClick={props.onRemove.bind({}, props.file)}>
        <DeleteIcon />
      </IconButton>
    );
  }

  // Set the thumb
  let thumb = null;
  if (file.isImage() && file.id) {
    let imageSource = server.host + "/antfs/images/" + file.id;
    thumb = (<img src={imageSource}/>);
  } else {
    let fileTypeClassName = file.getIconClassName();
    thumb = (<i className={fileTypeClassName}/>);
  }

  // Set the classes for div container
  let divClasses = classnames(theme.fileUpload, theme.fileUploadContainer);

  return (
    <div className={divClasses}>
      <div className={theme.fileUploadThumb}>
        {thumb}
      </div>
      <div className={theme.fileUploadDetails}>
        <div className={theme.fileUploadName}>
          {props.file.name}
        </div>
        {displayProgress}
        <div className={statusClass}>
          {status} {fileView}
        </div>
      </div>
      <div className={theme.fileUploadRemove}>
        {displayRemoveBtn}
      </div>
    </div>
  );
}

/**
 * File that is used when uploading a file or displaying an attached file
 */
File.propTypes = {
  index: React.PropTypes.string.isRequired,

  /**
   * Object representing a file entity (but not an entity)
   *
   * @var {File}
   */
  file: React.PropTypes.instanceOf(FileModel),

  /**
   * If true the show progress bar when uploading a file
   */
  displayProgress: React.PropTypes.bool,

  /**
   * Callback to call when the user removes a file
   */
  onRemove: React.PropTypes.func
};

/**
 * Set property defaults
 */
File.defaultProps = {
  displayProgress: false
};

export default File;
