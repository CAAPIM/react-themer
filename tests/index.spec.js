/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import React from 'react';
import { mount } from 'enzyme';
import { create as createThemer } from 'ca-ui-themer';
import reactThemer, { create as createReactThemer } from '../src';
import TestComponent from './fixtures/TestComponent';
import theme from './fixtures/theme';
import functionTheme from './fixtures/functionTheme';
import globalTheme from './fixtures/globalTheme';

describe('reactThemer', () => {
  it('should throw if no component is passed', () => {
    expect(reactThemer(theme)).toThrow();
  });

  it('should pass back the display name and theme as a prop', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    const renderedComponent = mount(React.createElement(themerReactClass));

    expect(renderedComponent.name()).toBe('Themer(TestComponent)');
    expect(renderedComponent.find(TestComponent).prop('theme')).toEqual(theme);
  });

  it('should wrap the original component if used twice', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).toBe('Themer(TestComponent)');
  });

  it('should ignore the previous rawThemerAttrs if component is not defined', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    delete themerReactClass.rawThemerAttrs.component;
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).toBe('Themer(Themer(TestComponent))');
  });

  it('should ignore the previous rawThemerAttrs if themes is not defined', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    delete themerReactClass.rawThemerAttrs.themes;
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).toBe('Themer(Themer(TestComponent))');
  });

  it('should ignore the previous rawThemerAttrs if themes is not an array', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    themerReactClass.rawThemerAttrs.themes = {};
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).toBe('Themer(Themer(TestComponent))');
  });

  it('should run middleware from passed in Themer instance', () => {
    const themer = createThemer();

    const mockMiddleware = jest.fn().mockImplementation(component => component);
    themer.setMiddleware(mockMiddleware);

    const themerReactClass = createReactThemer(themer)(theme)(TestComponent);
    mount(React.createElement(themerReactClass));

    expect(mockMiddleware).toHaveBeenCalledTimes(1);
  });

  it('should use global theme vars if theme context is defined', () => {
    const themerReactClass = reactThemer(functionTheme)(TestComponent);
    const renderedComponent = mount(React.createElement(themerReactClass), {
      context: { theme: globalTheme },
    });

    const renderedThemeProp = renderedComponent.find(TestComponent).prop('theme');
    expect(renderedThemeProp.styles.root.color).toBe(globalTheme.variables.mainColor);
  });

  it('should set global vars to undefined if no global theme is defined', () => {
    const defaultGlobalVars = { mainColor: 'purple' };
    const testFunctionTheme = {
      variables: (_, globalVars = defaultGlobalVars) => ({
        color: globalVars.mainColor || 'blue',
      }),
      styles: (_, vars) => ({
        root: {
          color: vars.color,
        },
      }),
    };
    const themerReactClass = reactThemer(testFunctionTheme)(TestComponent);
    const renderedComponent = mount(React.createElement(themerReactClass));

    const renderedThemeProp = renderedComponent.find(TestComponent).prop('theme');
    expect(renderedThemeProp.styles.root.color).toBe(defaultGlobalVars.mainColor);
  });

  it('should call resolveAttributes only once', () => {
    const themer = createThemer();

    // override resolveAttributes with spy function
    const resolveAttributesSpy = jest.fn().mockImplementation(
      (...args) => themer.resolveAttributes(...args),
    );
    const themerSpy = { resolveAttributes: resolveAttributesSpy };

    // create themed component
    const themerReactClass = createReactThemer(themerSpy)(theme)(TestComponent);

    // render themed component twice
    mount(
      <div>
        <div>{React.createElement(themerReactClass)}</div>
        <div>{React.createElement(themerReactClass)}</div>
      </div>,
    );

    expect(resolveAttributesSpy).toHaveBeenCalledTimes(1);
  });
});
