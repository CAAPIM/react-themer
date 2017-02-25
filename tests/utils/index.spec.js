/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { getDisplayName } from '../../src/utils';
import TestComponent from '../fixtures/TestComponent';

// use dirty chai to avoid unused expressions
describe('getDisplayName', () => {
  it('should return empty string if falsy argument is provided', () => {
    expect(getDisplayName(null)).toBe('');
  });

  it('should return the unchanged argument if a string is passed', () => {
    expect(getDisplayName('some text here')).toBe('some text here');
  });

  it('should return the component display name if defined', () => {
    expect(getDisplayName(TestComponent)).toBe('TestComponent');
  });

  it('should return the component name property if defined', () => {
    expect(getDisplayName({ name: 'TestComponentName' })).toBe('TestComponentName');
  });

  it('should prioritize displayName over name property', () => {
    expect(getDisplayName({ displayName: 'TestComponent', name: 'TestComponentName' })).toBe('TestComponent');
  });

  it('should return "Component" if neither displayName nor name are defined for the component', () => {
    expect(getDisplayName({})).toBe('Component');
  });
});
