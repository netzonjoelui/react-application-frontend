/**
 * Render the application shell for a small device
 *
 */
import React from 'react';
import theme from './theme-large.scss';
import ChamelThemeProvider from 'chamel/lib/styles/ChamelThemeProvider';
import materialTheme from 'chamel/lib/styles/theme/material';

// Chamel Icons
import PhotoCameraIcon from 'chamel/lib/icons/font/PhotoCameraIcon';

/**
 * Render the application shell for a large device
 */
class Large extends React.Component {
  render() {
    return (
      <ChamelThemeProvider chamelTheme={materialTheme}>
        <div>
          <div id="app-header" className={theme.appHeaderLarge}>
            <div id="app-header-logo" className={theme.appHeaderLogoCon}>
              <img src={this.props.logoSrc} id="app-header-logo" />
            </div>
            <div id="app-header-search" className={theme.appHeaderSearchCon}>
              Search goes here
            </div>
            <div className={theme.appHeaderProfileCon}>
              <PhotoCameraIcon />
            </div>
          </div>
          <div id="app-body" ref="appMain" className={theme.appBodyLarge}></div>
        </div>
      </ChamelThemeProvider>
    );
  }
}


export default Large;
