/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../../src/theme-provider';
import TestComponent from '../fixtures/TestComponent';
import theme from '../fixtures/theme';

const props = {
  theme,
};

describe('ThemeProvider', () => {
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
