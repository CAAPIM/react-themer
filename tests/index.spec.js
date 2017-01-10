/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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

    themerInstance.setTheme([theme]);

    themerInstance.setMiddleware((component) => {
      return component;
    });

    const themerReactClass = createReactThemer(themerInstance)(theme)(TestComponent);
    const renderedComponent = renderer.render(React.createElement(themerReactClass));

    expect(renderedComponent.type.displayName).to.exist;
    expect(renderedComponent.props.theme.styles).to.exist;
    expect(renderedComponent.props.theme.variables).to.exist;
  });
});
