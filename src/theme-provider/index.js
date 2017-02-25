/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
// @flow

import React from 'react';
import { themer } from 'ca-ui-themer';

const OnlyChildren = ({ children }) => (
  children ?
    React.Children.only(children) :
    null
);

export default class ThemeProvider extends React.Component {
  static propTypes = {
    theme: React.PropTypes.object.isRequired,
    themer: React.PropTypes.object,
    children: React.PropTypes.node,
  };

  static childContextTypes = {
    theme: React.PropTypes.object,
  };

  getChildContext() {
    return {
      theme: this.props.theme,
    };
  }

  componentWillMount() {
    const themerInstance = this.props.themer || themer;

    // Fetch the resolved Component and theme from the themerInstance
    this.resolvedAttrs = themerInstance.resolveAttributes(OnlyChildren, [this.props.theme]);
  }

  resolvedAttrs: Object = {};

  render() {
    return React.createElement(this.resolvedAttrs.snippet, {}, this.props.children);
  }
}
