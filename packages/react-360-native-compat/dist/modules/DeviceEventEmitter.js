function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
export default class DeviceEventEmitter {
  constructor() {
    _defineProperty(this, "_callbacks", {});
  }

  addListener(name, callback) {
    if (!this._callbacks[name]) {
      this._callbacks[name] = [];
    }

    this._callbacks[name].push(callback);

    return {
      name,
      callback
    };
  }

  removeAllListeners(name) {
    this._callbacks[name] = [];
  }

  removeSubscription(subscription) {
    const callbacks = this._callbacks[subscription.name];

    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(subscription.callback);

    if (index < 0) {
      return;
    }

    callbacks.splice(index, 1);
  }

  emit(name, data) {
    const callbacks = this._callbacks[name] || [];

    for (const cb of callbacks) {
      cb(data);
    }
  }

}