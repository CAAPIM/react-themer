/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

export default {
  variables: (vars: Object, globalVars?: Object = {}) => ({
    color: globalVars.mainColor || 'blue',
  }),
  styles: (styles: Object, vars?: Object = {}) => ({
    root: {
      color: vars.color,
    },
  }),
};
