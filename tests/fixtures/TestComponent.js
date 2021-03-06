/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import React from 'react';

export default class TestComponent extends React.Component {

  componentWillMount() {
    this.test = 'Test';
  }

  test: string;

  render() {
    return (
      <div>{this.test}</div>
    );
  }

}
