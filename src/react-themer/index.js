/**
 * Copyright (c) 2016 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import { themer } from 'themer';
import React, { Component, PropTypes } from 'react';
import { getDisplayName } from 'recompose';

export default (customThemer: ?Object) => (theme?: Object) => (component: React.Element<*>) => {
  const componentTheme = component.theme || {};
  const themerInstance = customThemer || themer;

  let DecoratedComponent;
  let generatedThemeVars = null;
  let generatedThemeStyles = null;

  return class extends Component {
    static displayName = getDisplayName(component);

    static contextTypes = {
      theme: PropTypes.object,
    };

    componentWillMount() {
      const { theme: globalTheme } = this.context;

      // Set the theme instance if it's not already been set
      if (!generatedThemeVars && !generatedThemeStyles && !DecoratedComponent) {
        themerInstance.setTheme([componentTheme, theme]);
      }

      if (!generatedThemeVars) {
        generatedThemeVars = themer.getThemeVariables(globalTheme);
      }

      if (!generatedThemeStyles && generatedThemeVars) {
        generatedThemeStyles = themer.getThemeStyles(generatedThemeVars);
      }

      if (!DecoratedComponent) {
        DecoratedComponent = themer.resolveMiddleware(component);
      }
    }

    render() {
      return (
        <DecoratedComponent
          {...this.props}
          theme={{
            styles: generatedThemeVars,
            variables: generatedThemeStyles,
          }}
        />
      );
    }
  };
};
