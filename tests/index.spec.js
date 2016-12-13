import { expect } from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { themer } from 'themer';
import reactThemer, { create as createReactThemer } from '../src';
import TestComponent from './fixtures/TestComponent';
import theme from './fixtures/theme';


describe('reactThemer', () => {
  it('should pass back the display name and theme as a prop', () => {
    const renderer = ReactTestUtils.createRenderer();
    const themerReactClass = reactThemer(theme)(TestComponent);
    const renderedComponent = renderer.render(React.createElement(themerReactClass));

    expect(renderedComponent.type.displayName).to.exist;
    expect(renderedComponent.props.theme.styles).to.exist;
    expect(renderedComponent.props.theme.variables).to.exist;
  });

  it('should run middleware from passed in Themer instance', () => {
    const renderer = ReactTestUtils.createRenderer();
    const themerInstance = themer;

    themer.setTheme([theme]);

    themer.setMiddleware((component) => {
      return component;
    });

    const themerReactClass = createReactThemer(themer)(theme)(TestComponent);
    const renderedComponent = renderer.render(React.createElement(themerReactClass));

    expect(renderedComponent.type.displayName).to.exist;
    expect(renderedComponent.props.theme.styles).to.exist;
    expect(renderedComponent.props.theme.variables).to.exist;
  });
});
