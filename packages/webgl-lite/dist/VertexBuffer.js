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

/* global $ArrayBufferView */

/**
 * Wrapper class for a GL buffer, designed to hide boilerplate for setting
 * and binding the buffer.
 */
export default class VertexBuffer {
  constructor(gl) {
    this._gl = gl;
    this._buffer = gl.createBuffer();
  }
  /**
   * Store data in the backing GL buffer
   */


  bufferData(data) {
    const gl = this._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  }
  /**
   * Attach the buffer to a specific attribute location
   */


  bindToAttribute(location, size, type, normalize, stride, offset) {
    const gl = this._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(location);
  }

}