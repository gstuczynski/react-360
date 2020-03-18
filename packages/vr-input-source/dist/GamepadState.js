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

/* global $Values */
import * as EventTypes from './InputEventTypes';
import detectPrimaryButtons from './detectPrimaryButtons';
import emulatePosition from './emulatePosition';
export default class GamepadState {
  constructor(gamepad) {
    this._callbacks = {};

    for (const key in EventTypes) {
      const event = EventTypes[key];
      this._callbacks[event] = [];
    }

    this._lastButtons = [];

    for (const button of gamepad.buttons) {
      this._lastButtons.push({
        touched: false,
        pressed: !!button.pressed
      });
    }

    this._gamepadIndex = gamepad.index;
    this._primaryButtons = detectPrimaryButtons(gamepad);

    if (gamepad.pose) {
      const pose = gamepad.pose;

      if (pose.orientation) {
        this._lastOrientation = pose.orientation;
        this._hasPosition = pose.hasPosition;

        if (pose.hasPosition && pose.position) {
          this._lastPosition = pose.position;
        } else {
          this._lastPosition = new Float32Array([0, 0, 0]);
          emulatePosition(pose.orientation, this._lastPosition, gamepad.hand);
        }
      }
    }
  }

  _fireCallbacks(event, payload) {
    const callbacks = this._callbacks[event];

    for (const cb of callbacks) {
      cb(payload);
    }
  }

  addEventListener(event, cb) {
    if (!(event in this._callbacks)) {
      return;
    }

    this._callbacks[event].push(cb);
  }

  update(gamepad) {
    if (!gamepad) {
      // Gamepad was disconnected
      // Fire end events for all pressed buttons
      for (let i = 0; i < this._lastButtons.length; i++) {
        const last = this._lastButtons[i];

        if (!last) {
          continue;
        }

        if (last.pressed) {
          const primary = !!this._primaryButtons[i];
          const event = {
            gamepadIndex: this._gamepadIndex,
            index: i,
            primary
          };

          if (primary) {
            this._fireCallbacks(EventTypes.SELECT_START, event);
          }

          this._fireCallbacks(EventTypes.PRESS_START, event);
        }
      }

      return;
    }

    if (gamepad.pose) {
      const pose = gamepad.pose;

      if (pose.orientation) {
        this._lastOrientation = pose.orientation;

        if (this._hasPosition && pose.position) {
          this._lastPosition = pose.position;
        } else {
          emulatePosition(pose.orientation, this._lastPosition, gamepad.hand);
        }
      }
    }

    const buttons = gamepad.buttons;

    for (let i = 0; i < this._lastButtons.length; i++) {
      const button = buttons[i];
      const last = this._lastButtons[i];

      if (!last) {
        this._lastButtons[i] = {
          pressed: false,
          touched: false
        };
      }

      const lastPressed = last.pressed;
      last.pressed = button.pressed;

      if (!button || !last) {
        continue;
      }

      if (button.pressed && !lastPressed) {
        const primary = !!this._primaryButtons[i];
        const event = {
          gamepadIndex: this._gamepadIndex,
          index: i,
          primary
        };

        if (primary) {
          this._fireCallbacks(EventTypes.SELECT_START, event);
        }

        this._fireCallbacks(EventTypes.PRESS_START, event);
      }

      if (!button.pressed && lastPressed) {
        const primary = !!this._primaryButtons[i];
        const event = {
          gamepadIndex: this._gamepadIndex,
          index: i,
          primary
        };

        if (primary) {
          this._fireCallbacks(EventTypes.SELECT_END, event);

          this._fireCallbacks(EventTypes.SELECT, event);
        }

        this._fireCallbacks(EventTypes.PRESS_END, event);

        this._fireCallbacks(EventTypes.PRESS, event);
      }
    }
  }
  /**
   * Is the position generated from a virtual arm model, rather than absolutely
   * recorded coordinates?
   */


  isPositionEmulated() {
    return !this._hasPosition;
  }
  /**
   * Get position vector [x, y, z]
   */


  getPosition() {
    return this._lastPosition;
  }
  /**
   * Get orientation quaternion [x, y, z, w]
   */


  getOrientation() {
    return this._lastOrientation;
  }

}