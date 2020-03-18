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
import * as WebGL from 'webgl-lite';
import getExtension from '../getExtension';
const FORMATS = {
  ogg: 'video/ogg; codecs="theora, vorbis"',
  mp4: 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"',
  mkv: 'video/x-matroska; codecs="theora, vorbis"',
  webm: 'video/webm; codecs="vp8, vorbis"'
};
let supportCache = null;

function fillSupportCache() {
  const video = document.createElement('video');
  supportCache = [];

  for (const type in FORMATS) {
    const canPlay = video.canPlayType(FORMATS[type]);

    if (canPlay.length && canPlay !== 'no') {
      supportCache.push(type);
    }
  }
}
/**
 * Implements a video player interface using the browser's native video
 * playback abilities.
 */


export default class BrowserVideoImplementation {
  constructor(gl) {
    _defineProperty(this, "_onEnded", () => {
      if (this._loop) {
        this._element.currentTime = 0;

        this._element.play();
      } else {
        this._playing = false;
      }
    });

    this._gl = gl;
    this._playing = false;
    this._element = document.createElement('video');
    this._element.muted = true;
    this._element.style.display = 'none'; // Prevents the default go to fullscreen behavior on iOS 10+

    this._element.setAttribute('playsinline', 'playsinline');

    this._element.setAttribute('webkit-playsinline', 'webkit-playsinline');

    this._element.crossOrigin = 'anonymous';
    this._texture = new WebGL.Texture(gl);

    if (document.body) {
      document.body.appendChild(this._element);
    }

    this._ready = false;
    this._loop = false;

    this._element.addEventListener('ended', this._onEnded);
  }

  setSource(src, format) {
    let source = '';

    if (Array.isArray(src)) {
      const supported = this.constructor.getSupportedFormats();

      for (const s of src) {
        if (!source) {
          const ext = getExtension(s);

          if (supported.indexOf(ext) > -1) {
            source = s;
          }
        }
      }
    } else {
      source = src;
    }

    this._ready = false;
    this._element.src = source;

    this._element.load();

    this._element.addEventListener('canplay', () => {
      this._ready = true;

      this._texture.setSource(this._element);

      if (this._playing) {
        this._element.play();
      }
    });
  }

  getTexture() {
    return this._texture;
  }

  update() {
    if (this._ready && this._playing) {
      this._texture.update();
    }
  }

  setVolume(vol) {
    this._element.volume = Math.max(0, Math.min(vol, 1));
  }

  setMuted(muted) {
    this._element.muted = muted;
  }

  setLoop(loop) {
    this._loop = loop;
  }

  play() {
    if (this._ready) {
      this._element.play();
    }

    this._playing = true;
  }

  pause() {
    if (this._ready) {
      this._element.pause();
    }

    this._playing = false;
  }

  seekTo(position) {
    this._element.currentTime = position;
  }

  isPlaying() {
    return this._playing;
  }

  destroy() {
    this.pause();

    if (this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }

    this._texture.release();

    this._element.src = '';
  }

  static getSupportedFormats() {
    if (!supportCache) {
      fillSupportCache();
    }

    return supportCache || [];
  }

}