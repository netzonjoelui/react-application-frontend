/**
 * Render the application shell for a small device
 *
 */
import React from 'react';
import ChamelThemeProvider from 'chamel/lib/styles/ChamelThemeProvider';
import materialTheme from 'chamel/lib/styles/theme/material';

/**
 * Small application component
 */
class Small extends React.Component {
  render() {
    return (
      <div>
        <ChamelThemeProvider chamelTheme={materialTheme}>
          <div ref="appMain"></div>
        </ChamelThemeProvider>
      </div>
    );
  }
};

export default Small;
