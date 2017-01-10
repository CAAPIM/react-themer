/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { expect } from 'chai';
import { getDisplayName } from '../../src/utils';
import TestComponent from '../fixtures/TestComponent';

describe('getDisplayName', () => {
  it('should return undefined if no argument is provided', () => {
    expect(getDisplayName()).to.not.exist;
  });

  it('should return the unchanged argument if a string is passed', () => {
    expect(getDisplayName('some text here')).to.equal('some text here');
  });

  it('should return the component display name if defined', () => {
    expect(getDisplayName(TestComponent)).to.equal('TestComponent');
  });

  it('should return the component name property if defined', () => {
    expect(getDisplayName({ name: 'TestComponentName' })).to.equal('TestComponentName');
  });

  it('should prioritize displayName over name property', () => {
    expect(getDisplayName({ displayName: 'TestComponent', name: 'TestComponentName' })).to.equal('TestComponent');
  });

  it('should return "Component" if neither displayName nor name are defined for the component', () => {
    expect(getDisplayName({})).to.equal('Component');
  });
});
