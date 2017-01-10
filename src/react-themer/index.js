/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import { themer } from 'themer';
import React, { Component, PropTypes } from 'react';
import { getDisplayName } from '../utils';

export default (customThemer: ?Object) => (theme?: Object) => (component: React.Element<*>) => {
  let rawThemerAttrs;
  if (component.rawThemerAttrs) {
    rawThemerAttrs = {
      component: component.rawThemerAttrs.component,
      themes: [...component.rawThemerAttrs.themes, theme],
    };
  } else {
    rawThemerAttrs = {
      component,
      themes: [theme],
    };
  }

  const themerInstance = customThemer || themer;

  let resolvedAttrs;
  let themesToResolve;

  return class extends Component {
    static displayName = `Themer(${getDisplayName(rawThemerAttrs.component)})`;
    static rawThemerAttrs = rawThemerAttrs;

    static contextTypes = {
      theme: PropTypes.object,
    };

    componentWillMount() {
      const { theme: globalTheme } = this.context;

      if (!resolvedAttrs) {
        // Merge global theme vars with the current theme if necessary
        if (globalTheme && globalTheme.variables) {
          themesToResolve = [{ variables: globalTheme.variables }, ...rawThemerAttrs.themes];
        } else {
          themesToResolve = rawThemerAttrs.themes;
        }

        // Fetch the resolved Component and theme from the themerInstance
        resolvedAttrs = themerInstance.resolveAttributes(rawThemerAttrs.component, themesToResolve);
      }
    }

    render() {
      return React.createElement(resolvedAttrs.snippet, {
        ...this.props,
        theme: resolvedAttrs.theme,
      });
    }
  };
};
