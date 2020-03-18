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
import GLRoot from './GLRoot';
export default class CanvasRoot extends GLRoot {
  constructor(options = {}) {
    const canvas = options.canvas || document.createElement('canvas');
    canvas.style.backgroundColor = 'transparent';
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false
    });

    if (gl == null) {
      throw new Error('Unable to construct WebGL context');
    }

    super(gl, options.text);

    _defineProperty(this, "_onClick", () => {
      this.getSurface().dispatchEvent('click');
    });

    _defineProperty(this, "_onPressIn", () => {
      this.getSurface().dispatchEvent('input', {
        buttonClass: 'confirm',
        action: 'down'
      });
    });

    _defineProperty(this, "_onPressOut", () => {
      this.getSurface().dispatchEvent('input', {
        buttonClass: 'confirm',
        action: 'up'
      });
    });

    _defineProperty(this, "_onTouchStart", e => {
      this._setCursorFromTouch(e, true);

      this._onPressIn();

      e.preventDefault();
    });

    _defineProperty(this, "_onTouchMove", e => {
      this._setCursorFromTouch(e, false);
    });

    _defineProperty(this, "_onMouseMove", e => {
      this.getSurface().setCursor(e.offsetX, e.offsetY);
    });

    _defineProperty(this, "_onMouseLeave", () => {
      this.getSurface().clearCursor();
    });

    this._canvas = canvas;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const width = options.width || (options.canvas ? options.canvas.width : 300);
    const height = options.height || (options.canvas ? options.canvas.height : 300);
    this.resize(width, height);
    canvas.addEventListener('click', this._onClick);
    canvas.addEventListener('mousemove', this._onMouseMove);
    canvas.addEventListener('mouseleave', this._onMouseLeave);
    canvas.addEventListener('mousedown', this._onPressIn);
    canvas.addEventListener('mouseup', this._onPressOut);
    canvas.addEventListener('touchstart', this._onTouchStart);
    canvas.addEventListener('touchend', this._onPressOut);
    canvas.addEventListener('touchmove', this._onTouchMove);
  }

  resize(width, height) {
    const pixelRatio = window.devicePixelRatio || 1;
    this._canvas.width = width * pixelRatio;
    this._canvas.height = height * pixelRatio;
    this._canvas.style.width = width + 'px';
    this._canvas.style.height = height + 'px';
    this.getGLContext().viewport(0, 0, width * pixelRatio, height * pixelRatio);
    this.getSurface().setViewport(width, height);
  }

  getCanvas() {
    return this._canvas;
  }

  _setCursorFromTouch(e, forceHitDetection) {
    if (!e.touches) {
      return;
    }

    const touch = e.touches[0];

    if (!touch) {
      return;
    }

    let offsetTop = 0;
    let offsetLeft = 0;
    let offsetTarget = e.target;

    while (offsetTarget != null) {
      // $FlowFixMe
      offsetTop += offsetTarget.offsetTop; // $FlowFixMe

      offsetLeft += offsetTarget.offsetLeft; // $FlowFixMe

      offsetTarget = offsetTarget.offsetTarget;
    }

    this.getSurface().setCursor(touch.clientX - offsetLeft, touch.clientY - offsetTop, !!forceHitDetection);
  }

}