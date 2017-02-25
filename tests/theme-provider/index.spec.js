/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* eslint-disable no-console */

import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../../src/theme-provider';
import TestComponent from '../fixtures/TestComponent';
import theme from '../fixtures/theme';

const props = {
  theme,
};
const error = console.error;

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Throw errors on console warnings to detect prop types validation
    console.error = (warning, ...args) => {
      if (/(Invalid prop|Failed prop type)/.test(warning)) {
        throw new Error(warning);
      }

      error.apply(console, [warning, ...args]);
    };
  });

  afterEach(() => {
    console.error = error;
  });

  it('should fail prop type validation for invalid theme', () => {
    expect(() => <ThemeProvider theme="etse" ><TestComponent /></ThemeProvider>).toThrow();
  });

  it('should contain child prop', () => {
    const ProviderComponent = <ThemeProvider {...props}><TestComponent /></ThemeProvider>;
    const renderedComponent = mount(ProviderComponent);

    expect(renderedComponent.prop('children')).toBeTruthy();
  });

  it('should not contain child prop', () => {
    const ProviderComponent = <ThemeProvider {...props} />;
    const renderedComponent = mount(ProviderComponent);

    expect(renderedComponent.prop('children')).toBeUndefined();
  });
});
