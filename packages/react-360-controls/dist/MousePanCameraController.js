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
const DEFAULT_FOV = Math.PI / 3;
const HALF_PI = Math.PI / 2;
export default class MousePanCameraController {
  constructor(frame, fov = DEFAULT_FOV) {
    _defineProperty(this, "_onMouseDown", e => {
      if (!this._enabled) {
        return;
      }

      this._draggingMouse = true;
      this._lastMouseX = e.clientX;
      this._lastMouseY = e.clientY;
    });

    _defineProperty(this, "_onMouseMove", e => {
      if (!this._draggingMouse) {
        return;
      }

      const width = this._frame.clientWidth;
      const height = this._frame.clientHeight;
      const aspect = width / height;
      const deltaX = e.clientX - this._lastMouseX;
      const deltaY = e.clientY - this._lastMouseY;
      this._lastMouseX = e.clientX;
      this._lastMouseY = e.clientY;
      this._deltaPitch += deltaX / width * this._verticalFov * aspect;
      this._deltaYaw += deltaY / height * this._verticalFov;
      this._deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, this._deltaYaw));
    });

    _defineProperty(this, "_onMouseUp", () => {
      this._draggingMouse = false;
    });

    _defineProperty(this, "_onTouchStart", e => {
      if (!this._enabled) {
        return;
      }

      this._draggingTouch = true;
      this._lastTouchX = e.changedTouches[0].clientX;
      this._lastTouchY = e.changedTouches[0].clientY;
    });

    _defineProperty(this, "_onTouchMove", e => {
      if (!this._draggingTouch) {
        return;
      }

      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      const width = this._frame.clientWidth;
      const height = this._frame.clientHeight;
      const aspect = width / height;
      const deltaX = x - this._lastTouchX;
      const deltaY = y - this._lastTouchY;
      this._lastTouchX = x;
      this._lastTouchY = y;
      this._deltaPitch += deltaX / width * this._verticalFov * aspect;
      this._deltaYaw += deltaY / height * this._verticalFov;
      this._deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, this._deltaYaw));
    });

    _defineProperty(this, "_onTouchEnd", e => {
      this._draggingTouch = false;
    });

    this._deltaYaw = 0;
    this._deltaPitch = 0;
    this._draggingMouse = false;
    this._draggingTouch = false;
    this._enabled = true;
    this._frame = frame;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._lastTouchX = 0;
    this._lastTouchY = 0;
    this._verticalFov = fov;

    this._frame.addEventListener('mousedown', this._onMouseDown);

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);

    this._frame.addEventListener('touchstart', this._onTouchStart);

    this._frame.addEventListener('touchmove', this._onTouchMove);

    this._frame.addEventListener('touchcancel', this._onTouchEnd);

    this._frame.addEventListener('touchend', this._onTouchEnd);
  }

  enable() {
    this._enabled = true;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  disable() {
    this._enabled = false;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  fillCameraProperties(position, rotation) {
    if (!this._enabled) {
      return false;
    }

    if (this._deltaPitch === 0 && this._deltaYaw === 0) {
      return false;
    } // premultiply the camera rotation by the horizontal (pitch) rotation,
    // then multiply by the vertical (yaw) rotation


    const cp = Math.cos(this._deltaPitch / 2);
    const sp = Math.sin(this._deltaPitch / 2);
    const cy = Math.cos(this._deltaYaw / 2);
    const sy = Math.sin(this._deltaYaw / 2);
    const x1 = rotation[0];
    const y1 = rotation[1];
    const z1 = rotation[2];
    const w1 = rotation[3];
    const x2 = cp * x1 + sp * z1;
    const y2 = cp * y1 + sp * w1;
    const z2 = cp * z1 - sp * x1;
    const w2 = cp * w1 - sp * y1;
    const x3 = w2 * sy + x2 * cy;
    const y3 = y2 * cy + z2 * sy;
    const z3 = -y2 * sy + z2 * cy;
    const w3 = w2 * cy - x2 * sy;
    rotation[0] = x3;
    rotation[1] = y3;
    rotation[2] = z3;
    rotation[3] = w3;
    this._deltaPitch = 0;
    this._deltaYaw = 0;
    return true;
  }

}