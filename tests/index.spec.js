/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import chai from 'chai';
import dirtyChai from 'dirty-chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { themer } from 'ca-ui-themer';
import reactThemer, { create as createReactThemer } from '../src';
import TestComponent from './fixtures/TestComponent';
import theme from './fixtures/theme';

// use dirty chai to avoid unused expressions
chai.use(dirtyChai);
const expect = chai.expect;

describe('reactThemer', () => {
  it('should pass back the display name and theme as a prop', () => {
    const renderer = ReactTestUtils.createRenderer();
    const themerReactClass = reactThemer(theme)(TestComponent);
    const renderedComponent = renderer.render(React.createElement(themerReactClass));

    expect(renderedComponent.type.displayName).to.exist();
    expect(renderedComponent.props.theme.styles).to.exist();
    expect(renderedComponent.props.theme.variables).to.exist();
  });

  it('should wrap the original component if used twice', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).to.equal('Themer(TestComponent)');
  });

  it('should ignore the previous rawThemerAttrs if component is not defined', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    delete themerReactClass.rawThemerAttrs.component;
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).to.equal('Themer(Themer(TestComponent))');
  });

  it('should ignore the previous rawThemerAttrs if themes is not defined', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    delete themerReactClass.rawThemerAttrs.themes;
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).to.equal('Themer(Themer(TestComponent))');
  });

  it('should ignore the previous rawThemerAttrs if themes is not an array', () => {
    const themerReactClass = reactThemer(theme)(TestComponent);
    themerReactClass.rawThemerAttrs.themes = {};
    const themerReactClass2 = reactThemer(theme)(themerReactClass);
    expect(themerReactClass2.displayName).to.equal('Themer(Themer(TestComponent))');
  });

  it('should run middleware from passed in Themer instance', () => {
    const renderer = ReactTestUtils.createRenderer();
    const themerInstance = themer;

    themerInstance.setTheme([theme]);

    themerInstance.setMiddleware((component) => component);

    const themerReactClass = createReactThemer(themerInstance)(theme)(TestComponent);
    const renderedComponent = renderer.render(React.createElement(themerReactClass));

    expect(renderedComponent.type.displayName).to.exist();
    expect(renderedComponent.props.theme.styles).to.exist();
    expect(renderedComponent.props.theme.variables).to.exist();
  });
});
