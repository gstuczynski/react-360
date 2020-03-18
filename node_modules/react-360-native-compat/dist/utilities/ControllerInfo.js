/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import NativeModules from '../modules/NativeModules';

class ControllerInfo {
  constructor(modules) {
    this._modules = modules;
  }

  getControllers() {
    return this._modules.ControllerInfo.getControllers();
  }

}

const ControllerInfoSingleton = new ControllerInfo(NativeModules);
export default ControllerInfoSingleton;