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
export default class Transition {
  constructor(fn, duration, delay = 0) {
    this._fn = fn;
    this._duration = duration;
    this._delay = delay;
  }

  getDelay() {
    return this._delay;
  }

  getDuration() {
    return this._duration;
  }

  getValueAtTime(ms) {
    if (ms < this._delay) {
      return 0;
    }

    if (ms > this._delay + this._duration) {
      return 1;
    }

    return this._fn((ms - this._delay) / this._duration);
  }

  equals(other) {
    if (!other) {
      return false;
    }

    return other._delay === this._delay && other._duration === this._duration && other._fn === this._fn;
  }

}