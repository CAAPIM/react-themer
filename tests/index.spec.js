/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import React from 'react';
import { mount } from 'enzyme';
import { create as createThemer } from 'ca-ui-themer';
import reactThemer, { create as createReactThemer } from '../src';
import TestComponent from './fixtures/TestComponent';
import theme from './fixtures/theme';

describe('reactThemer', () => {
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

    expect(mockMiddleware.mock.calls.length).toBe(1);
  });
});
