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
import { Texture } from 'webgl-lite';
import FontMeasure from './FontMeasure';
import AtlasNode from './AtlasNode';
// x, y, width, height

/**
 * Texture atlas for storing font glyphs.
 * Atlas implements the data structures necessary to rasterize glyphs to a GPU
 * texture, store the metrics associated with those glyphs, and track remaining
 * empty space in the texture. As glyphs are needed by a text implementation,
 * they can be generated, and the corresponding metrics & pixel offsets can be
 * fetched. If there is no space, the atlas will double the size of the texture,
 * up to a maximum size.
 */
export default class Atlas {
  constructor(gl, width = 256, height = 256, fontSize = 20, fontFamily = 'sans-serif') {
    this._density = Math.floor(window.devicePixelRatio || 1);
    this._width = width;
    this._height = height;
    this._fontSize = fontSize;
    this._fontFamily = fontFamily;
    this._glyphs = {};
    this._root = new AtlasNode(0, 0, width, height);
    this._canvas = document.createElement('canvas');
    this._canvas.width = width * this._density;
    this._canvas.height = height * this._density;
    this._context = this._canvas.getContext('2d');

    this._context.clearRect(0, 0, width * this._density, height * this._density);

    this._context.fillStyle = '#fff';
    this._context.font = `${fontSize * this._density}px ${fontFamily}`;
    this._measure = new FontMeasure(fontSize, fontFamily);
    this._texture = new Texture(gl);

    this._texture.setSource(this._canvas);
  }

  getTexture() {
    return this._texture;
  }

  expand() {
    const image = this._context.getImageData(0, 0, this._width * this._density, this._height * this._density);

    const nextWidth = this._width * 2;
    const nextHeight = this._height * 2;

    if (nextWidth > 1024 || nextHeight > 1024) {
      throw new Error('Cannot make the font atlas any bigger');
    }

    this._root.resize(nextWidth, nextHeight);

    this._canvas.width = nextWidth * this._density;
    this._canvas.height = nextHeight * this._density;
    this._width = nextWidth;
    this._height = nextHeight;

    this._context.putImageData(image, 0, 0);

    this._context.fillStyle = '#fff';
    this._context.font = `${this._fontSize * this._density}px ${this._fontFamily}`;

    this._texture.setSource(this._canvas);
  }

  has(glyph) {
    return glyph in this._glyphs;
  }

  generate(glyph) {
    if (glyph in this._glyphs) {
      return false;
    }

    const metrics = this._measure.measureGlyph(glyph); // Find free space in the atlas for our new glyph


    const neededWidth = metrics.width;
    const neededHeight = metrics.ascend + metrics.descend;

    let loc = this._root.insert(neededWidth, neededHeight);

    while (!loc) {
      // Can't fit the rectangle, we need to expand the atlas
      this.expand();
      loc = this._root.insert(neededWidth, neededHeight);
    }

    loc.key = glyph; // Draw the glyph to the atlas. Baseline is location-top-left + ascend

    this._context.fillText(glyph, loc.x * this._density, (loc.y + metrics.ascend) * this._density);

    this._glyphs[glyph] = {
      location: loc,
      metrics
    };
    return true;
  }

  getMetrics(glyph) {
    const data = this._glyphs[glyph];

    if (!data) {
      return null;
    }

    return data.metrics;
  }

  getUV(glyph) {
    const data = this._glyphs[glyph];

    if (!data) {
      return [0, 0, 0, 0];
    }

    const {
      location
    } = data;
    return [location.x * this._density, location.y * this._density, location.width * this._density, location.height * this._density];
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

}