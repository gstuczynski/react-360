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
export default class AudioModule {
  constructor(container) {
    this._audio = container.audio;
  }

  createAudio(handle, options) {
    this._audio.createAudio(handle, options);
  }

  playOneShot(options) {
    this._audio.playOneShot(options);
  }

  playEnvironmental(options) {
    this._audio.playEnvironmental(options);
  }

  setParams(handle, options) {
    this._audio.setParams(handle, options);
  }

  setEnvironmentalParams(options) {
    this._audio.setEnvironmentalParams(options);
  }

  play(handle, options) {
    this._audio.play(handle, options);
  }

  stop(handle) {
    this._audio.stop(handle);
  }

  pause(handle) {
    this._audio.pause(handle);
  }

  seek(handle, time) {
    this._audio.seek(handle, time);
  }

  stopEnvironmental() {
    this._audio.stopEnvironmental();
  }

  destroy(handle) {
    this._audio.destroy(handle);
  }

  load(source, onReady) {
    this._audio.load(source).then(() => {
      onReady();
    });
  }

  unload(source) {
    this._audio.unload(source);
  }

}