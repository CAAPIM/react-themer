/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import {
  themer,
  mapThemeProps,
  applyVariantsProps,
} from 'ca-ui-themer';
import React, { Component, PropTypes } from 'react';
import mapProps from 'recompose/mapProps';
import { getDisplayName } from '../utils';

const applyVariantsDecorator = mapProps(applyVariantsProps);

export default (customThemer: ?Object) => (theme?: Object) => (component: React.Element<*>) => {
  if (!component) {
    throw new Error('ca-ui-react-themer: a component is required');
  }

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

  return class extends Component {
    static displayName = `Themer(${getDisplayName(rawThemerAttrs.component)})`;
    static rawThemerAttrs = rawThemerAttrs;

    static contextTypes = {
      theme: PropTypes.object,
    };

    componentWillMount() {
      if (resolvedAttrs) {
        return;
      }

      // Check if global theme defines any variables
      const { theme: globalTheme } = this.context;
      const globalVars = globalTheme && globalTheme.variables ? globalTheme.variables : null;

      // apply variants decorator
      const componentWithVariants = applyVariantsDecorator(rawThemerAttrs.component);

      // Fetch the resolved Component and theme from the themerInstance
      resolvedAttrs = themerInstance.resolveAttributes(
        componentWithVariants, rawThemerAttrs.themes, globalVars);
    }

    render() {
      return React.createElement(
        resolvedAttrs.snippet,
        mapThemeProps(this.props, resolvedAttrs.theme)
      );
    }
  };
};
