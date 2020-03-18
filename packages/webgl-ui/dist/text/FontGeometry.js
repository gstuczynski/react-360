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
import wrapText from './wrapText';
export const Align = {
  auto: 'left',
  left: 'left',
  right: 'right',
  center: 'center',
  justify: 'left'
};
export default class FontGeometry {
  // Width of the span the alignment is relative to
  // Specify the font to use, if supported by implementation
  // Tracks whether geometry needs to be recomputed
  // Layout information
  // Tracks whether layout information is dirty
  // Requested line height
  // Maximum width the text can fill before breaking
  // Font size, in pixels
  // Text string to display
  constructor(gl, impl, text, options = {}) {
    this._align = options.align || Align.auto;
    this._fontFamily = options.family || '';
    this._geometryDirty = true;
    this._impl = impl;
    this._infoDirty = false;
    this._maxWidth = undefined;
    this._size = options.size || 20;
    this._lineHeight = options.lineHeight || null;
    this._text = text;
    this._info = wrapText(this._impl, this._fontFamily, this._size, this._text);
    this._node = this._impl.createNode();

    this._impl.updateGeometry(this._node, this._info, this.getParams());
  }

  getParams() {
    // Override this method in your subclass to provide extra parameters like
    // font width, etc.
    return {
      align: this._align,
      alignWidth: this._alignWidth,
      lineHeight: this._lineHeight
    };
  }

  getWidth() {
    const lines = this._info.lines;
    let width = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineWidth = lines[i].width;

      if (lineWidth > width) {
        width = lineWidth;
      }
    }

    return width;
  }

  getHeight() {
    const lines = this._info.lines;
    const lineHeight = this._lineHeight == null ? Math.ceil(this._size * 1.2) : this._lineHeight;
    return lineHeight * lines.length;
  }

  getNode() {
    return this._node;
  }

  getSize() {
    return this._size;
  }

  markGeometryDirty() {
    this._geometryDirty = true;
  }

  setAlign(align) {
    this._align = align;
    this._geometryDirty = true;
  }

  setAlignWidth(width) {
    this._alignWidth = width;
  }

  setColor(color) {
    const colorVec4 = [(color >> 16 & 0xff) / 255, (color >> 8 & 0xff) / 255, (color & 0xff) / 255, (color >> 24 & 0xff) / 255];

    this._node.setUniform('u_color', colorVec4);
  }

  setFontFamily(family) {
    this._fontFamily = family;
    this._infoDirty = true;
  }

  setLineHeight(height) {
    if (this._lineHeight !== height) {
      this._infoDirty = true;
    }

    this._lineHeight = height;
  }

  setMaxWidth(width) {
    if (this._maxWidth !== width) {
      this._infoDirty = true;
    }

    this._maxWidth = width;
  }

  setSize(size) {
    this._size = Math.max(1, size);
    this._infoDirty = true;
  }

  setText(text) {
    this._text = text;
    this._infoDirty = true;
  }

  setWeight(numericWeight) {// no-op
  }

  update() {
    if (this._infoDirty) {
      this._info = wrapText(this._impl, this._fontFamily, this._size, this._text, this._maxWidth);
      this._geometryDirty = true;
      this._infoDirty = false;
    }

    if (this._geometryDirty) {
      this._impl.updateGeometry(this._node, this._info, this.getParams());

      this._geometryDirty = false;
    }
  }

}