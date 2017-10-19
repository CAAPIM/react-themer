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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mapProps from 'recompose/mapProps';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import type { ProvidedThemeProps } from 'ca-ui-themer';
import type { HigherOrderComponent } from 'react-flow-types';

import { getDisplayName } from '../utils';

/**
 * Define Higher Order Component type
 * @type {WithThemeDecorator}
 */
type WithThemeDecorator = HigherOrderComponent<{}, ProvidedThemeProps>;

/**
 * Create variants prop mapper with `recompsoe/mapProps`
 * @type {HigherOrderComponent}
 */
const applyVariantsDecorator = mapProps(applyVariantsProps);

/**
 * Build themer attributes based on input component and current theme.
 *
 * @param  {any} component  Input component
 * @param  {Object} theme   Current theme
 * @return {Object}         New object with `component` and `themes` array
 */
const getRawThemerAttrs = (component: any, theme?: Object) => {
  if (
    component &&
    component.rawThemerAttrs &&
    component.rawThemerAttrs.component &&
    component.rawThemerAttrs.themes &&
    Array.isArray(component.rawThemerAttrs.themes)
  ) {
    return {
      component: component.rawThemerAttrs.component,
      themes: [...component.rawThemerAttrs.themes, theme],
    };
  }

  return {
    component,
    themes: [theme],
  };
};

/**
 * Check if component exists.
 * @param  {any} component  Component to check
 * @return {void}           Throws an error if component is falsy
 */
const validateComponent = (component: any) => {
  if (!component) {
    throw new Error('ca-ui-react-themer: a component is required');
  }
};

/**
 * Create `withTheme` decorator based using the provided Themer instance
 * @param  {Object} themerInstance  Themer instance that will be used to resolve themes
 * @return {Function}               `withTheme` decorator
 */
const createWithTheme = (themerInstance: Object) => (theme?: Object): WithThemeDecorator => (
  component: any,
) => {
  validateComponent(component);
  const rawThemerAttrs = getRawThemerAttrs(component, theme);

  /**
   * Resolved theme attributes are cached after first mount of this component type.
   * We assume that all instances of this themed components will share the same theme context.
   */
  let resolvedAttrsCache;

  /**
   * Maintain a record of the current theme to compare future iterations against
   */
  let currentTheme;

  /**
   * Create decorated class component
   */
  class DecoratedClassComponent extends Component {

    /**
     * Wrap `displayName` of original component with Themer()
     * @type {string}
     */
    static displayName = `Themer(${getDisplayName(rawThemerAttrs.component)})`;

    /**
     * Set static attribute `rawThemerAttrs` to allow themes to be extended
     * @type {Object}
     */
    static rawThemerAttrs = rawThemerAttrs;

    /**
     * Define context types to get global theme object
     * @type {Object}
     */
    static contextTypes = {
      theme: PropTypes.object,
    };

    /**
     * Resolve component themes when component mounts for the first time
     * @return {void}
     */
    componentWillMount() {
      // Check if global theme defines any variables
      const { theme: globalTheme } = this.context;
      currentTheme = globalTheme;

      // Get global theme ID
      const globalThemeId = globalTheme && globalTheme.id ? globalTheme.id : undefined;

      // check if resolved theme attributes are already available
      // check if theme ID has changed
      if (resolvedAttrsCache && resolvedAttrsCache.id === globalThemeId) {
        return;
      }

      // Check if global theme defines any variables
      const globalVars = globalTheme && globalTheme.variables ? globalTheme.variables : undefined;

      // apply variants decorator
      const componentWithVariants = applyVariantsDecorator(rawThemerAttrs.component);

      // Fetch the resolved Component and theme from the themerInstance
      resolvedAttrsCache = themerInstance.resolveAttributes(
        componentWithVariants, rawThemerAttrs.themes, globalVars);

      // cache global theme ID
      resolvedAttrsCache.id = globalThemeId;
    }

    /**
     * Resolve component themes when component updates and a new theme is present
     * @return {void}
     */
    componentDidUpdate() {
      // Check if global theme defines any variables
      const { theme: globalTheme } = this.context;

      // Get global theme ID
      const globalThemeId = globalTheme && globalTheme.id ? globalTheme.id : undefined;

      // check if currentTheme associated the the component matches the global.
      // If not, update the currentTheme
      if (isEmpty(currentTheme) || isEmpty(globalTheme) || isEqual(currentTheme, globalTheme)) {
        return;
      }

      currentTheme = globalTheme;

      // Check if global theme defines any variables
      const globalVars = globalTheme && globalTheme.variables ? globalTheme.variables : undefined;

      // apply variants decorator
      const componentWithVariants = applyVariantsDecorator(rawThemerAttrs.component);

      // Fetch the resolved Component and theme from the themerInstance
      resolvedAttrsCache = themerInstance.resolveAttributes(
        componentWithVariants, rawThemerAttrs.themes, globalVars);

      // cache global theme ID
      resolvedAttrsCache.id = globalThemeId;
    }

    /**
     * Render themed component
     * @return {React.Element<*>}
     */
    render() {
      return React.createElement(
        resolvedAttrsCache.snippet,
        mapThemeProps(this.props, resolvedAttrsCache.theme),
      );
    }
  }

  /**
   * Return decorated component.
   *
   * We disable Flow for this line because `react-flow-types` only supports
   * Higher Order Components that return Functional components (not class components).
   */
  // $FlowFixMe
  return DecoratedClassComponent;
};

/**
 * Create `withTheme` decorator and assigns themer instance
 * to `withTheme.themer` attribute for convenience.
 *
 * @param  {Themer} customThemer  custom instance of `Themer` that will be used to resolve themes
 * @return {Function}             `withTheme` decorator with `themer` attribute
 */
const createDecorator = (customThemer?: ?Object) => {
  const themerInstance = customThemer || themer;
  const withTheme = createWithTheme(themerInstance);
  withTheme.themer = themerInstance;

  return withTheme;
};

export default createDecorator;
