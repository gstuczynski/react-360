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
import * as React from 'react';
import { View } from './Primitives'; // eslint-disable-line no-unused-vars

export default class Pressable extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      hovered: false,
      pressed: false
    });

    _defineProperty(this, "_onInput", event => {
      if (event.buttonClass !== 'confirm') {
        return;
      }

      if (this.state.pressed) {
        if (event.action === 'up') {
          this.setState({
            pressed: false
          });

          if (this.props.onPress) {
            this.props.onPress(event);
          }

          if (this.props.onPressOut) {
            this.props.onPressOut(event);
          }
        }
      } else {
        if (event.action === 'down') {
          this.setState({
            pressed: true
          });

          if (this.props.onPressIn) {
            this.props.onPressIn(event);
          }
        }
      }
    });

    _defineProperty(this, "_onEnter", () => {
      this.setState({
        hovered: true
      });

      if (this.props.onHoverIn) {
        this.props.onHoverIn();
      }
    });

    _defineProperty(this, "_onExit", () => {
      if (this.state.pressed) {
        if (this.props.onPressOut) {
          this.props.onPressOut();
        }
      }

      this.setState({
        hovered: false,
        pressed: false
      });

      if (this.props.onHoverOut) {
        this.props.onHoverOut();
      }
    });
  }

  render() {
    const {
      children,
      style
    } = this.props;
    const currentState = {
      hovered: this.state.hovered,
      pressed: this.state.pressed
    };
    return React.createElement(View, {
      style: style,
      onEnter: this._onEnter,
      onExit: this._onExit,
      onInput: this._onInput
    }, typeof children === 'function' ? children(currentState) : children);
  }

}