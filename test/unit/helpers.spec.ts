import assert from 'assert';
import { vec2, vec3 } from 'gl-matrix';

import { copyVector2, copyVector3 } from '../../src/transform/helpers';

describe('helpers', () => {
  describe('copyVector2', () => {
    it('copies both components', () => {
      const target = vec2.create();
      copyVector2(target, vec2.fromValues(3, -4));
      assert.deepStrictEqual(Array.from(target), [3, -4]);
    });

    it('replaces NaN with 0', () => {
      const target = vec2.fromValues(1, 1);
      copyVector2(target, vec2.fromValues(NaN, 5));
      assert.deepStrictEqual(Array.from(target), [0, 5]);
    });
  });

  describe('copyVector3', () => {
    it('copies all three components', () => {
      const target = vec3.create();
      copyVector3(target, vec3.fromValues(1, 2, 3));
      assert.deepStrictEqual(Array.from(target), [1, 2, 3]);
    });

    it('replaces NaN with 0', () => {
      const target = vec3.fromValues(9, 9, 9);
      copyVector3(target, vec3.fromValues(1, NaN, NaN));
      assert.deepStrictEqual(Array.from(target), [1, 0, 0]);
    });
  });
});
