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
export default class EnvironmentModule {
  constructor(container) {
    this._env = container.environment;
  }

  loadScene(scene, transition) {
    transition = transition || {};

    if (scene.type === 'black') {
      this._env.setSource(null);

      return;
    }

    if (scene.type === 'photo') {
      this._env.setSource(scene.url, {
        format: scene.stereo,
        transition: transition.transition,
        fadeLevel: transition.fadeLevel
      });

      this._env.setRotation('rotate' in scene ? scene.rotate : 0);

      return;
    }

    if (scene.type === 'video') {// not yet supported
    }
  }

}