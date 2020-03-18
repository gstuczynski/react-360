function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

/* global TimeoutID */
import * as React from 'react';
import { Pressable } from 'react-webgl'; // eslint-disable-line no-unused-vars

import NativeModules from '../modules/NativeModules';
const LONG_PRESS_THRESHOLD = 500;
export default class VrButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "_handleLongPress", () => {
      this._longPressTimeout = null;

      if (this.props.onLongClick) {
        this.props.onLongClick();
      }
    });

    _defineProperty(this, "_onHoverIn", () => {
      this.setState({
        hovered: true
      });

      this._enter();
    });

    _defineProperty(this, "_onHoverOut", () => {
      this.setState({
        hovered: false
      });

      this._exit();
    });

    _defineProperty(this, "_onPressIn", () => {
      if (this.props.disabled) {
        return;
      }

      if (this._longPressTimeout) {
        this._cancelLongPressTimeout();
      }

      const longDelayMS = this.props.longClickDelayMS ? Math.max(this.props.longClickDelayMS, 10) : LONG_PRESS_THRESHOLD;
      this._longPressTimeout = setTimeout(this._handleLongPress, longDelayMS);
    });

    _defineProperty(this, "_onPress", () => {
      if (this.props.disabled) {
        this._disabledClick();
      } else {
        this._click();
      }
    });

    _defineProperty(this, "_onPressOut", () => {
      this._cancelLongPressTimeout();
    });

    this._longPressTimeout = null;
    this.state = {
      hovered: false
    };
  }

  _playSound(source) {
    if ('AudioModule' in NativeModules) {
      // $FlowFixMe
      NativeModules.AudioModule.playOneShot({
        source
      });
    }
  }

  _enter() {
    if (this.props.onEnterSound) {
      this._playSound(this.props.onEnterSound);
    }

    if (this.props.onEnter) {
      this.props.onEnter();
    }
  }

  _exit() {
    this._cancelLongPressTimeout();

    if (this.props.onExitSound) {
      this._playSound(this.props.onExitSound);
    }

    if (this.props.onExit) {
      this.props.onExit();
    }
  }

  _disabledClick() {
    if (this.props.onDisableClickSound) {
      this._playSound(this.props.onDisableClickSound);
    }
  }

  _click() {
    if (this.props.onClickSound) {
      this._playSound(this.props.onClickSound);
    }

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  _cancelLongPressTimeout() {
    if (this._longPressTimeout != null) {
      clearTimeout(this._longPressTimeout);
      this._longPressTimeout = null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Handle transition states
    if (this.props.disabled !== prevProps.disabled) {
      // was disabled or enabled
      if (this.state.hovered) {
        // if the button is currently hovered, we need to simulate enter or exit events
        if (this.props.disabled) {
          this._exit();
        } else {
          this._enter();
        }
      }
    }
  }

  render() {
    const rest = {
      style: this.props.style
    };
    return React.createElement(Pressable, _extends({}, rest, {
      onHoverIn: this._onHoverIn,
      onHoverOut: this._onHoverOut,
      onPress: this._onPress,
      onPressIn: this._onPressIn,
      onPressOut: this._onPressOut
    }), this.props.children);
  }

}