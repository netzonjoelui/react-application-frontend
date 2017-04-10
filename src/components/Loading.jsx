import React from 'react';

// Chamel Controls
import CircularProgress from 'chamel/lib/Progress/CircularProgress';

const Loading = (props) => {
  const loadingStyle = {textAlign: 'center', margin: "16px"};

  return (
    <div className={props.className} style={loadingStyle}>
      <CircularProgress mode={"indeterminate"} />
    </div>
  );
};

export default Loading;
