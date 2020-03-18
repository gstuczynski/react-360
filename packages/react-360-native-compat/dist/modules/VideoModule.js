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
export default class VideoModule {
  constructor(container) {
    this._video = container.video;
  }

  createPlayer(handle) {
    this._video.createPlayer(handle);
  }

  destroyPlayer(handle) {
    this._video.destroyPlayer(handle);
  }

  play(handle, options) {
    const player = this._video.getPlayer(handle);

    if (!player) {
      return;
    }

    const {
      source,
      startPosition,
      ...params
    } = options;
    const stereoFormat = params.stereo || '2D';
    player.setSource(source.url, stereoFormat);

    if (startPosition) {
      player.seekTo(startPosition);
    }

    if ('volume' in params) {
      player.setVolume(params.volume);
    }

    if ('muted' in params) {
      player.setMuted(params.muted);
    }

    player.play();
  }

  pause(handle) {
    const player = this._video.getPlayer(handle);

    if (!player) {
      return;
    }

    player.pause();
  }

  resume(handle) {
    const player = this._video.getPlayer(handle);

    if (!player) {
      return;
    }

    player.play();
  }

  stop(handle) {
    const player = this._video.getPlayer(handle);

    if (!player) {
      return;
    }

    player.pause();
    player.seekTo(0);
  }

  seek(handle, timeMs) {
    const player = this._video.getPlayer(handle);

    if (!player) {
      return;
    }

    player.seekTo(timeMs);
  }

}