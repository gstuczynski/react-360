/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
import * as React from 'react';
import { Image } from './Primitives'; // eslint-disable-line no-unused-vars

export default class Video extends React.PureComponent {
  render() {
    const {
      source,
      style
    } = this.props;
    const uri = source ? `video://${source}` : '';
    return React.createElement(Image, {
      style: style,
      source: {
        uri
      }
    });
  }

}