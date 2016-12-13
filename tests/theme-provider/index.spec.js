import { expect } from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ThemeProvider from '../../src/theme-provider';
import TestComponent from '../fixtures/TestComponent';
import theme from '../fixtures/theme';

const props = {
  theme,
};
const renderer = ReactTestUtils.createRenderer();
const error = console.error;

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Throw errors on console warnings to detect prop types validation
    console.error = function(warning, ...args) {
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
    expect(() => <ThemeProvider theme='etse' ><TestComponent /></ThemeProvider>).to.throw();
  });

  it('should contain child prop', () => {
    const ProviderComponent = <ThemeProvider {...props}><TestComponent /></ThemeProvider>;
    const renderedComponent = renderer.render(ProviderComponent);

    expect(renderedComponent.props.children).to.exist;
  });

  it('should not contain child prop', () => {
    const ProviderComponent = <ThemeProvider {...props}></ThemeProvider>;
    const renderedComponent = renderer.render(ProviderComponent);

    expect(renderedComponent.props.children).to.not.exist;
  });
});
