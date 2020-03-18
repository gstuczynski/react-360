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

/**
 * ProgramManager ensures that you only create one instance of a WebGL program
 * per GL context.
 */
export default class ProgramManager {
  constructor(generator) {
    this._generator = generator;
    this._programMap = new Map();
  }

  getProgram(gl) {
    let prog = this._programMap.get(gl);

    if (!prog) {
      prog = this._generator(gl);

      this._programMap.set(gl, prog);
    }

    return prog;
  }

}