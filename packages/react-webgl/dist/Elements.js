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
import { Image, Text, View } from 'webgl-ui';
export const quad = {
  create: root => root.getSurface().createView(),
  dispatchers: (() => {
    const d = {};
    View.registerBindings(d);
    return d;
  })()
};
export const text = {
  create: root => root.getSurface().createText(),
  dispatchers: (() => {
    const d = {};
    Text.registerBindings(d);
    return d;
  })()
};
export const image = {
  create: root => root.getSurface().createImage(),
  dispatchers: (() => {
    const d = {};
    Image.registerBindings(d);
    return d;
  })()
};