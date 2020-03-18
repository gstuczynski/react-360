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

/* eslint-disable camelcase */
import GLTexturedView from '../primitives/GLTexturedView';
import TextureManager from '../TextureManager';
import colorStringToARGB from '../colorStringToARGB';
import ShadowViewWebGL from './ShadowViewWebGL';
export default class RCTImage extends ShadowViewWebGL {
  constructor(gl, textureManager) {
    super(gl, gl_ => new GLTexturedView(gl_));
    this._textures = textureManager;
  }

  setSource(value) {
    // Will use a centralized store soon
    if (!value || !value.uri) {
      this.view.setBackgroundImage(null);
      return;
    }

    this.view.setBackgroundImage(this._textures.getTextureForURL(value.uri));
  }

  __setStyle_resizeMode(mode) {
    this.view.setBackgroundResizeMode(mode);
  }

  __setStyle_tintColor(color) {
    const colorNumber = typeof color === 'number' ? color : colorStringToARGB(color);
    this.view.setTintColor(colorNumber);
  }

  static registerBindings(dispatch) {
    super.registerBindings(dispatch);
    dispatch.source = this.prototype.setSource;
  }

}