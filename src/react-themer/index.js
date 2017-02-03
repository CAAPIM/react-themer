/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import { themer } from 'ca-ui-themer';
import React, { Component, PropTypes } from 'react';
import { each } from 'lodash';
import { getDisplayName } from '../utils';

export default (customThemer: ?Object) => (theme?: Object) => (component: React.Element<*>) => {
  let rawThemerAttrs: Object;
  if (
    component.rawThemerAttrs &&
    component.rawThemerAttrs.component &&
    component.rawThemerAttrs.themes &&
    Array.isArray(component.rawThemerAttrs.themes)
  ) {
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

  class Main extends Component {
    static displayName = `Themer(${getDisplayName(rawThemerAttrs.component) || 'Component'})`;
    static rawThemerAttrs = rawThemerAttrs;

    static PropTypes = {};

    static contextTypes = {
      theme: PropTypes.object,
    };

    componentWillMount() {
      const { theme: globalTheme } = this.context;

      each(themerInstance.getVariants(), (value, key) => {
        Main.PropTypes[key] = React.PropTypes.bool;
      });

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
  }

  return Main;
};
