/**
 * Copyright (c) 2016 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import reactThemer from './react-themer';
import ThemeProvider from './theme-provider';

/**
 * Creates a new instance of reactThemer
 *
 * @param  {Object} options Options to instantiate reactThemer with
 * @public
 */
const create = (customThemer: Object) => reactThemer(customThemer);

export default reactThemer();

export {
  create,
  ThemeProvider,
};
