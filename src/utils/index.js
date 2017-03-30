/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* eslint-disable import/prefer-default-export */
// @flow

/**
 * Get the display name of a react component as a string
 *
 * @param  {string|Object}  Component The react component to get the name of
 * @return {string}        The name of the component as a string
 * @public
 */
export function getDisplayName(Component?: ?string | Object): string {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return '';
  }

  return Component.displayName || Component.name || 'Component';
}
