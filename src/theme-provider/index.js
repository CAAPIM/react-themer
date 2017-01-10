/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import React from 'react';
import { isFunction } from 'lodash';

let currentThemeId;
let componentThemeStyles;
let DecoratedComponent;

/**
 * Get styles property from theme object
 *
 * @param  {Object} theme a theme object as defined in 'themer'
 * @return {Object} the styles property from the them objet
 * @public
 */
const getThemeStyles = (theme: Object) => {
  if (isFunction(theme.styles)) {
    return theme.styles(theme.variables);
  }

  return theme.styles;
};

/**
 * Recalculate theme styles if themeId has changed
 *
 * @param  {Object} options.theme  a theme object as defined in 'themer'
 * @param  {int} options.themeId a themeId as defined in 'themer'
 * @param  {Funtion} options.decorator an optional decorator function to be used
 * @return {[type]}                   [description]
 * @public
 */
const calculateComponentThemeStyles = ({ theme, themeId, decorator }: Object) => {
  const WrappedComponent = ({ children }) => React.Children.only(children);

  if (!DecoratedComponent || (themeId && currentThemeId !== themeId)) {
    if (theme && theme.styles) {
      componentThemeStyles = getThemeStyles(theme);
    } else {
      componentThemeStyles = null;
    }

    if (isFunction(decorator) && componentThemeStyles) {
      DecoratedComponent = decorator(componentThemeStyles)(WrappedComponent);
    } else {
      DecoratedComponent = WrappedComponent;
    }
  }
};

export default class ThemeProvider extends React.Component {
  static propTypes = {
    theme: React.PropTypes.object.isRequired,
    children: React.PropTypes.node,
  };

  static childContextTypes = {
    theme: React.PropTypes.object,
  };

  getChildContext() {
    return {
      theme: this.props.theme,
    };
  }

  componentWillMount() {
    calculateComponentThemeStyles(this.props);
  }

  render() {
    return (
      <DecoratedComponent>{this.props.children}</DecoratedComponent>
    );
  }
}
