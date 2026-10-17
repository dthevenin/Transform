import assert from 'assert';
import { vec2, vec3 } from 'gl-matrix';

import { Transform } from '../../src/transform/transform';

const EPSILON = 1e-9;

// Maps a 2D point through a matrix (z = 0, w = 1).
function apply(matrix: DOMMatrix, x: number, y: number): [number, number] {
  const p = matrix.transformPoint(new DOMPoint(x, y, 0, 1));
  return [p.x, p.y];
}

function assertPoint(actual: [number, number], expected: [number, number]) {
  assert.ok(
    Math.abs(actual[0] - expected[0]) < EPSILON &&
      Math.abs(actual[1] - expected[1]) < EPSILON,
    `expected [${expected}] but got [${actual}]`,
  );
}

describe('Transform', () => {
  let transform: Transform;

  beforeEach(() => {
    transform = new Transform();
  });

  describe('getCTM', () => {
    it('is the identity for a new transform', () => {
      assert.ok(transform.getCTM().isIdentity);
    });

    it('applies a translation', () => {
      transform.translation = vec3.fromValues(10, 20, 0);
      assertPoint(apply(transform.getCTM(), 1, 2), [11, 22]);
    });

    it('applies a rotation in degrees around the z axis', () => {
      transform.rotation = vec3.fromValues(0, 0, 90);
      assertPoint(apply(transform.getCTM(), 1, 0), [0, 1]);
    });

    it('applies a uniform scale', () => {
      transform.scaling = 3;
      assertPoint(apply(transform.getCTM(), 2, -1), [6, -3]);
    });

    it('scales then rotates then translates', () => {
      transform.translation = vec3.fromValues(5, 0, 0);
      transform.rotation = vec3.fromValues(0, 0, 90);
      transform.scaling = 2;
      // (1, 0) -> scale (2, 0) -> rotate (0, 2) -> translate (5, 2)
      assertPoint(apply(transform.getCTM(), 1, 0), [5, 2]);
    });
  });

  describe('scaling', () => {
    it('defaults to 1', () => {
      assert.strictEqual(transform.scaling, 1);
    });

    it('returns the value that was set', () => {
      transform.scaling = 0.5;
      assert.strictEqual(transform.scaling, 0.5);
    });
  });

  describe('translation', () => {
    it('ignores vectors that do not have 3 components', () => {
      transform.translation = vec2.fromValues(10, 10) as unknown as vec3;
      assert.ok(transform.getCTM().isIdentity);
    });

    it('treats NaN components as 0', () => {
      transform.translation = vec3.fromValues(NaN, 4, 0);
      assertPoint(apply(transform.getCTM(), 0, 0), [0, 4]);
    });
  });

  describe('transformOrigin', () => {
    it('defaults to [0, 0]', () => {
      assert.deepStrictEqual(Array.from(transform.transformOrigin), [0, 0]);
    });

    it('returns a copy, not the internal vector', () => {
      const origin = transform.transformOrigin;
      origin[0] = 42;
      assert.deepStrictEqual(Array.from(transform.transformOrigin), [0, 0]);
    });

    it('ignores vectors that do not have 2 components', () => {
      transform.transformOrigin = vec3.fromValues(1, 2, 3) as unknown as vec2;
      assert.deepStrictEqual(Array.from(transform.transformOrigin), [0, 0]);
    });

    it('rotates and scales around the origin', () => {
      transform.transformOrigin = vec2.fromValues(10, 10);
      transform.rotation = vec3.fromValues(0, 0, 90);
      transform.scaling = 2;
      // The origin itself is a fixed point.
      assertPoint(apply(transform.getCTM(), 10, 10), [10, 10]);
      // (11, 10) is 1 unit right of the origin -> 2 units below it.
      assertPoint(apply(transform.getCTM(), 11, 10), [10, 12]);
    });

    it('folds the current transformation into the stack and resets it', () => {
      transform.translation = vec3.fromValues(5, 0, 0);
      transform.scaling = 2;
      const before = transform.getCTM();

      transform.transformOrigin = vec2.fromValues(50, 50);

      assert.strictEqual(transform.scaling, 1);
      assert.deepStrictEqual(transform.getCTM().toFloat64Array(), before.toFloat64Array());
    });

    it('stacks new transformations on top of previous ones', () => {
      transform.translation = vec3.fromValues(5, 0, 0);
      transform.transformOrigin = vec2.fromValues(0, 0);
      transform.scaling = 2;
      // Stacked translation first, then the new scale: (1, 0) -> (6, 0) -> (12, 0)
      assertPoint(apply(transform.getCTM(), 1, 0), [12, 0]);
    });
  });

  describe('clearTransformStack', () => {
    it('drops the stacked transformations but keeps the current ones', () => {
      transform.translation = vec3.fromValues(5, 0, 0);
      transform.transformOrigin = vec2.fromValues(0, 0);
      transform.scaling = 2;

      transform.clearTransformStack();

      assertPoint(apply(transform.getCTM(), 1, 0), [2, 0]);
    });
  });
});
