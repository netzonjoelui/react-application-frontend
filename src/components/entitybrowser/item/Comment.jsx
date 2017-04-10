/**
 * List Item used where object type is 'comment'
 */
import React from 'react';
import theme from './_comment.scss';
import EntityModel from '../../../models/entity/Entity';
import UserProfileImage from '../../UserProfileImage';
import File from '../../fileattachment/File';

/**
 * List item for a comment
 */
export const CommentItem = (props) => {

  const entity = props.entity;
  const userId = entity.getValue("owner_id");
  const headerText = entity.getValueName("owner_id", userId);
  const headerTime = entity.getTime(null, true);
  const actors = entity.getActors();
  let comment = entity.getValue("comment") || null;

  // Convert new lines to line breaks
  if (comment) {
    const regularExperssion = new RegExp("\n", 'gi');
    comment = {__html: comment.replace(regularExperssion, "<br />")};
  }

  // Get the attached files
  const files = entity.getAttachments();
  let attachedFiles = [];
  let attachedFilesImage = [];

  for (let idx in files) {
    let file = files[idx];

    // Check if file is an image
    if (file.isImage()) {
      attachedFilesImage.push(
        <img
          key={idx}
          src={file.getFileUrl()}
        />
      );
    } else {
      attachedFiles.push(
        <File
          key={idx}
          index={idx}
          file={file}
        />
      );
    }
  }

  return (
    <div className={theme.entityBrowserComment}>
      <div className={theme.entityBrowserCommentImg}>
        <UserProfileImage
          width={32}
          userId={userId}
        />
      </div>
      <div className={theme.entityBrowserCommentDetails}>
        <div className={theme.entityBrowserCommentHeader}>
          {headerText}
          <div className={theme.entityBrowserCommentTime}>
            {headerTime}
          </div>
        </div>
        <div className={theme.entityBrowserCommentBody}>
          <div dangerouslySetInnerHTML={comment}/>
          <div className={theme.entityBrowserCommentAttachments}>
            {attachedFilesImage}
            {attachedFiles}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Properties this component accepts
 */
CommentItem.propTypes = {
  /**
   * The entity we are printing
   *
   * TODO: Instead of passing the entity model, pass only the entity data and create the entity instance inside this component
   * @var {Entity}
   */
  entity: React.PropTypes.instanceOf(EntityModel),
}

export default CommentItem;