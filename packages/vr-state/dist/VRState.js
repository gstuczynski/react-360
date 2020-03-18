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

/* global VRDisplayEvent */

/**
 * State management for VR Display
 */
export default class VRState {
  constructor() {
    _defineProperty(this, "onDisplayActivate", ({
      display
    }) => {
      if (display === this.vrDisplay) {
        this._callActivateCallbacks();
      }
    });

    _defineProperty(this, "onDisplayDeactivate", ({
      display
    }) => {
      if (display === this.vrDisplay) {
        this._callDeactivateCallbacks();
      }
    });

    _defineProperty(this, "onDisplayConnect", ({
      display
    }) => {
      if (this.vrDisplay) {
        return;
      }

      this.setCurrentDisplay(display);
    });

    _defineProperty(this, "onDisplayDisconnect", ({
      display
    }) => {
      // If `display` is not the current display, return.
      // If presenting, exit presenting, clean up.
      // Query remaining displays.
      // If display list is not empty, set the current display to the first one
      // Else, clear the current display, set state to disconnected
      if (display !== this.vrDisplay) {
        return;
      }

      if (typeof navigator.getVRDisplays === 'function') {
        navigator.getVRDisplays().then(displays => {
          if (displays.length === 0) {
            this.setCurrentDisplay(displays[0]);
          } else {
            this.setCurrentDisplay(null);
          }
        });
      }
    });

    _defineProperty(this, "onDisplayPresentChange", ({
      display
    }) => {
      if (this.vrDisplay && display && display.displayId === this.vrDisplay.displayId) {
        if (display.isPresenting) {
          this._callEnterCallbacks();
        } else {
          this._callExitCallbacks();
        }
      }
    });

    this._displayChangeCallbacks = [];
    this._enterCallbacks = [];
    this._exitCallbacks = [];
    this._activateCallbacks = [];
    this._deactivateCallbacks = []; // Listen for headsets that connect / disconnect after the page has loaded

    window.addEventListener('vrdisplayconnect', this.onDisplayConnect);
    window.addEventListener('vrdisplaydisconnect', this.onDisplayDisconnect); // Listen for headset activation / deactivation

    window.addEventListener('vrdisplayactivate', this.onDisplayActivate);
    window.addEventListener('vrdisplaydeactivate', this.onDisplayDeactivate); // Listen for presentation changes to catch external triggers (like the back button)

    window.addEventListener('vrdisplaypresentchange', this.onDisplayPresentChange);

    if (typeof navigator.getVRDisplays === 'function') {
      navigator.getVRDisplays().then(displays => {
        if (displays.length) {
          this.setCurrentDisplay(displays[0]);
        }
      });
    }
  }

  _callEnterCallbacks() {
    for (let i = 0; i < this._enterCallbacks.length; i++) {
      this._enterCallbacks[i](this.vrDisplay);
    }
  }

  _callExitCallbacks() {
    for (let i = 0; i < this._exitCallbacks.length; i++) {
      this._exitCallbacks[i](this.vrDisplay);
    }
  }

  _callDisplayChangeCallbacks() {
    for (let i = 0; i < this._displayChangeCallbacks.length; i++) {
      this._displayChangeCallbacks[i](this.vrDisplay);
    }
  }

  _callActivateCallbacks() {
    for (let i = 0; i < this._activateCallbacks.length; i++) {
      this._activateCallbacks[i](this.vrDisplay);
    }
  }

  _callDeactivateCallbacks() {
    for (let i = 0; i < this._deactivateCallbacks.length; i++) {
      this._deactivateCallbacks[i](this.vrDisplay);
    }
  }

  onEnter(cb) {
    this._enterCallbacks.push(cb);
  }

  onExit(cb) {
    this._exitCallbacks.push(cb);
  }

  onDisplayChange(cb) {
    this._displayChangeCallbacks.push(cb);
  }

  onActivate(cb) {
    this._activateCallbacks.push(cb);
  }

  onDeactivate(cb) {
    this._deactivateCallbacks.push(cb);
  }

  setCurrentDisplay(display) {
    if (display === this.vrDisplay) {
      return;
    }

    this.vrDisplay = display;

    this._callDisplayChangeCallbacks();
  }

  getCurrentDisplay() {
    return this.vrDisplay;
  }

  isPresenting() {
    return !!this.vrDisplay && this.vrDisplay.isPresenting;
  }

}