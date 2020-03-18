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

/* eslint-disable camelcase, no-param-reassign */
import * as Flexbox from '../vendor/Yoga.bundle';
import ShadowView from './ShadowView';
import recursiveLayout from '../recursiveLayout';
import colorStringToARGB from '../colorStringToARGB';
export default class ShadowViewWebGL extends ShadowView {
  constructor(gl, viewCreator) {
    super();
    this._gl = gl;
    this._borderRadiusDirty = false;
    this._cursor = null;
    this._hasOnLayout = false;
    this._layoutOrigin = [0, 0];
    this._zIndex = 0;
    this._renderOrder = 0;
    this.view = viewCreator(gl);
  }

  addChild(index, child) {
    super.addChild(index, child);

    if (child instanceof ShadowViewWebGL) {
      const node = this.view.getNode();

      if (node.renderGroup) {
        child.setRenderGroup(node.renderGroup);
      }

      child.setParentTransform(this.view.getWorldTransform());
    } else {
      throw new Error('Cannot add unsupported child');
    }
  }

  removeChild(index) {
    const child = this.children[index];

    if (child instanceof ShadowViewWebGL) {
      child.removeFromRenderGroup();
    } else {
      throw new Error('Cannot remove unsupported child');
    }

    super.removeChild(index);
  }

  removeFromRenderGroup() {
    const node = this.view.getNode();

    if (node.renderGroup) {
      node.renderGroup.removeNode(node);
    }

    for (const child of this.children) {
      // $FlowFixMe
      child.removeFromRenderGroup();
    }
  }

  setRenderGroup(rg) {
    const node = this.view.getNode();

    if (node.renderGroup !== rg) {
      if (node.renderGroup) {
        node.renderGroup.removeNode(node);
      }

      rg.addNode(node);

      for (const child of this.children) {
        // $FlowFixMe
        child.setRenderGroup(rg);
      }
    }
  }

  getZIndex() {
    return this._zIndex;
  }

  getRenderOrder() {
    return this._renderOrder;
  }

  presentLayout() {
    this.evaluateActiveTransitions();
    let childrenNeedUpdate = false;

    if (this.YGNode.getHasNewLayout()) {
      this.YGNode.setHasNewLayout(false);
      const left = this.YGNode.getComputedLeft();
      const top = this.YGNode.getComputedTop();
      const width = this.YGNode.getComputedWidth();
      const height = this.YGNode.getComputedHeight();
      const x = -this._layoutOrigin[0] * width;
      const y = -this._layoutOrigin[1] * height;
      const layoutHook = this._onLayoutHook;

      if (this._hasOnLayout && layoutHook) {
        layoutHook(this.getTag(), {
          x: x + left,
          y: y + top,
          width: width,
          height: height
        });
      }

      this.view.setVisible(this.YGNode.getDisplay() !== Flexbox.DISPLAY_NONE);
      this.view.setBorderWidth(this._getBorderValue(Flexbox.EDGE_TOP), this._getBorderValue(Flexbox.EDGE_RIGHT), this._getBorderValue(Flexbox.EDGE_BOTTOM), this._getBorderValue(Flexbox.EDGE_LEFT));
      this.view.setFrame(x + left, -(y + top), width, height);
      childrenNeedUpdate = true;
    }

    if (this.isTransformDirty()) {
      this.view.setLocalTransform(this.getTransform());
      childrenNeedUpdate = true;
      this.setTransformDirty(false);
    }

    if (this._borderRadiusDirty) {
      const borderRadius = typeof this._borderRadiusAll === 'number' && this._borderRadiusAll > 0 ? this._borderRadiusAll : 0;
      this.view.setBorderRadius(typeof this._borderTopLeftRadius === 'number' && this._borderTopLeftRadius > 0 ? this._borderTopLeftRadius : borderRadius, typeof this._borderTopRightRadius === 'number' && this._borderTopRightRadius > 0 ? this._borderTopRightRadius : borderRadius, typeof this._borderBottomRightRadius === 'number' && this._borderBottomRightRadius > 0 ? this._borderBottomRightRadius : borderRadius, typeof this._borderBottomLeftRadius === 'number' && this._borderBottomLeftRadius > 0 ? this._borderBottomLeftRadius : borderRadius);
      this._borderRadiusDirty = false;
    }

    this.view.update();

    if (childrenNeedUpdate) {
      for (const c of this.children) {
        if (c instanceof ShadowViewWebGL) {
          c.setParentTransform(this.view.getWorldTransform());
          const width = this.view.getWidth();
          const height = this.view.getHeight();
          c.view.setOffset(-width / 2, -height / 2);
        }
      }
    }
  }

  updateLayoutAndGeometry() {
    this.calculateLayout();
    recursiveLayout(this);
  }

  frame() {}

  setOnLayout(value) {
    this._hasOnLayout = !!value;
  }

  setOnLayoutHook(hook) {
    this._onLayoutHook = hook;
  }

  setRenderOrder(order) {
    this._renderOrder = order;

    if (this.view) {
      this.view.getNode().renderOrder = order;
    }
  }

  setParentTransform(transform) {
    this.view.setParentTransform(transform);
    this.setTransformDirty(true);
  }

  getCursor() {
    return this._cursor;
  }

  containsPoint(x, y) {
    return this.view.containsPoint(x, y);
  }

  _getBorderValue(edge) {
    const value = this.YGNode.getBorder(edge);
    const allValue = this.YGNode.getBorder(Flexbox.EDGE_ALL);
    return Number.isNaN(value) ? Number.isNaN(allValue) ? 0 : allValue : value;
  }
  /* style setters */


  __setStyle_backgroundColor(color) {
    if (color == null) {
      color = 0;
    }

    const colorNumber = typeof color === 'number' ? color : colorStringToARGB(color);
    this.view.setBackgroundColor(colorNumber);
  }

  __setStyle_borderBottomLeftRadius(radius) {
    if (radius == null) {
      radius = 0.0;
    }

    this._borderBottomLeftRadius = radius;
    this._borderRadiusDirty = true;
  }

  __setStyle_borderBottomRightRadius(radius) {
    if (radius == null) {
      radius = 0.0;
    }

    this._borderBottomRightRadius = radius;
    this._borderRadiusDirty = true;
  }

  __setStyle_borderColor(color) {
    if (color == null) {
      color = 0xff000000;
    }

    const colorNumber = typeof color === 'number' ? color : colorStringToARGB(color);
    this.view.setBorderColor(colorNumber);
  }

  __setStyle_borderRadius(radius) {
    if (radius == null) {
      radius = 0.0;
    }

    this._borderRadiusAll = radius;
    this._borderRadiusDirty = true;
  }

  __setStyle_borderTopLeftRadius(radius) {
    if (radius == null) {
      radius = 0.0;
    }

    this._borderTopLeftRadius = radius;
    this._borderRadiusDirty = true;
  }

  __setStyle_borderTopRightRadius(radius) {
    if (radius == null) {
      radius = 0.0;
    }

    this._borderTopRightRadius = radius;
    this._borderRadiusDirty = true;
  }

  __setStyle_cursor(cursor) {
    this._cursor = cursor;
  }

  __setStyle_gradientColorA(color) {
    if (color == null) {
      color = 0xff000000;
    }

    const colorNumber = typeof color === 'number' ? color : colorStringToARGB(color);
    this.view.setGradientStart(colorNumber);
  }

  __setStyle_gradientColorB(color) {
    if (color == null) {
      color = 0xff000000;
    }

    const colorNumber = typeof color === 'number' ? color : colorStringToARGB(color);
    this.view.setGradientEnd(colorNumber);
  }

  __setStyle_gradientAngle(angle) {
    if (angle == null) {
      angle = '0deg';
    }

    let rad = 0;

    if (angle.endsWith('rad')) {
      rad = Number(angle.substr(0, angle.length - 3));
    } else if (angle.endsWith('deg')) {
      const deg = Number(angle.substr(0, angle.length - 3));
      rad = deg * Math.PI / 180;
    }

    if (isNaN(rad)) {
      rad = 0;
    }

    this.view.setGradientAngle(rad);
  }

  __setStyle_layoutOrigin(origin) {
    this._layoutOrigin[0] = origin[0];
    this._layoutOrigin[1] = origin[1];
  }

  __setStyle_opacity(opacity) {
    if (opacity == null) {
      opacity = 0;
    }

    this.view.setOpacity(opacity);
  }

  __setStyle_zIndex(z) {
    if (z == null) {
      z = 0;
    }

    this._zIndex = z;
  }

  static registerBindings(dispatch) {
    super.registerBindings(dispatch);
    dispatch.onLayout = this.prototype.setOnLayout;
  }

}