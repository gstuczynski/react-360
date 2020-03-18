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
// Function taking a time on an interval from 0 to 1, returning a value on a scale from 0 to 1
export function cubicBezier(a, b, c, d) {
  return function (t) {
    return Math.pow(1 - t, 3) * a + 3 * Math.pow(1 - t, 2) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d;
  };
}
export const linear = n => n;
export const easeIn = cubicBezier(0.42, 0, 1.0, 1.0);
export const easeOut = cubicBezier(0, 0, 0.58, 1.0);
export const easeInOut = cubicBezier(0.42, 0, 0.58, 1.0);