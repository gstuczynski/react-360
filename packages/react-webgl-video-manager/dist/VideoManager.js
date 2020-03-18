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
import getExtension from './getExtension';
import VideoPlayer from './VideoPlayer';
export default class VideoManager {
  constructor(textureManager) {
    this._players = {};
    this._playerImplementations = [];
    this._textureManager = textureManager; // register video hook on texture manager

    textureManager.registerCustomProtocol('video', url => {
      const name = url.replace(/^video:\/\//, '');
      const player = this._players[name];

      if (!player) {
        return null;
      }

      return player.getTexture();
    });
  }

  createPlayer(handle) {
    if (this._players[handle]) {
      return this._players[handle];
    }

    const player = new VideoPlayer(this);
    this._players[handle] = player;
    return player;
  }

  getPlayer(handle) {
    return this._players[handle];
  }

  destroyPlayer(handle) {
    const player = this._players[handle];

    if (!player) {
      return;
    }

    delete this._players[handle];
    player.destroy();
  }

  registerPlayerImplementation(impl) {
    this._playerImplementations.push(impl);
  }

  createPlayerImplementation(sources) {
    for (const src of sources) {
      const ext = getExtension(src);

      for (const Impl of this._playerImplementations) {
        // $FlowFixMe - no support for statics
        const supported = Impl.getSupportedFormats();

        if (supported.indexOf(ext) > -1) {
          // $FlowFixMe - can't instantiate an interface
          return new Impl(this._textureManager.getGLContext());
        }
      }
    }

    throw new Error('No registered player supports any of these files.');
  }

  update() {
    for (const handle in this._players) {
      this._players[handle].update();
    }
  }

}