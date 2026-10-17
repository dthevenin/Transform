define(['exports', 'gl-matrix', 'vs_ui_utils'], (function (exports, glMatrix, vs_ui_utils) { 'use strict';

  function copyVector2(target, source) {
    target[0] = isNaN(source[0]) ? 0 : source[0];
    target[1] = isNaN(source[1]) ? 0 : source[1];
  }
  function copyVector3(target, source) {
    target[0] = isNaN(source[0]) ? 0 : source[0];
    target[1] = isNaN(source[1]) ? 0 : source[1];
    target[2] = isNaN(source[2]) ? 0 : source[2];
  }

  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var _transform, _translation, _rotation, _scaling, _transformOrigin;
  class Transform {
    constructor() {
      __privateAdd(this, _transform);
      /**
       * Translation vector [tx, ty]
       * <=> obj.translate (tx, ty)
       * @type {Array}
       */
      __privateAdd(this, _translation, glMatrix.vec3.create());
      /**
       * Rotation angle in degree
       * @type {float}
       */
      __privateAdd(this, _rotation, glMatrix.vec3.create());
      __privateAdd(this, _scaling, 1);
      /**
       * Transformation center (origin)
       * @protected
       * @type {vec2}
       */
      __privateAdd(this, _transformOrigin, glMatrix.vec2.create());
    }
    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are percentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @type Array.<number>
     */
    set transformOrigin(v) {
      if (v.length !== 2) {
        return;
      }
      __privateSet(this, _transform, this.getCTM());
      copyVector2(__privateGet(this, _transformOrigin), v);
      __privateGet(this, _translation)[0] = 0;
      __privateGet(this, _translation)[1] = 0;
      __privateGet(this, _translation)[2] = 0;
      __privateGet(this, _rotation)[0] = 0;
      __privateGet(this, _rotation)[1] = 0;
      __privateGet(this, _rotation)[2] = 0;
      __privateSet(this, _scaling, 1);
    }
    /**
     * @ignore
     * @return {Array}
     */
    get transformOrigin() {
      return glMatrix.vec2.fromValues(__privateGet(this, _transformOrigin)[0], __privateGet(this, _transformOrigin)[1]);
    }
    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @type {Array}
     */
    set translation(v) {
      if (v.length !== 3) {
        return;
      }
      copyVector3(__privateGet(this, _translation), v);
    }
    /**
     * Rotation angle in degree
     * @type {float}
     */
    set rotation(v) {
      copyVector3(__privateGet(this, _rotation), v);
    }
    /**
     * Scale the view
     * @type {float}
     */
    set scaling(v) {
      __privateSet(this, _scaling, v);
    }
    /**
     * @ignore
     * @type {float}
     */
    get scaling() {
      return __privateGet(this, _scaling);
    }
    /**
     *  Remove all previous transformations set for this view
     */
    clearTransformStack() {
      __privateSet(this, _transform, void 0);
    }
    /**
     *  Return the current transform matrix apply to this graphic Object.
     *
     * @return {Matrix} the current transform matrix
     */
    getCTM() {
      let matrix = new DOMMatrix();
      matrix = matrix.translate(__privateGet(this, _transformOrigin)[0], __privateGet(this, _transformOrigin)[1], 0);
      matrix = matrix.translate(__privateGet(this, _translation)[0], __privateGet(this, _translation)[1], __privateGet(this, _translation)[2]);
      matrix = matrix.rotate(__privateGet(this, _rotation)[0], __privateGet(this, _rotation)[1], __privateGet(this, _rotation)[2]);
      matrix = matrix.scale(__privateGet(this, _scaling), __privateGet(this, _scaling), 1);
      matrix = matrix.translate(-__privateGet(this, _transformOrigin)[0], -__privateGet(this, _transformOrigin)[1], 0);
      return __privateGet(this, _transform) ? matrix.multiply(__privateGet(this, _transform)) : matrix;
    }
    // /**
    //  *  Returns the current transform combination matrix generate by the
    //  *  hierarchical parents of this graphic Object.
    //  *  Its returns the multiplication of the parent's CTM and parent of parent's
    //  *  CTM etc.
    //  *  If the component has no parent it returns the identity matrix.
    //  *
    //  * @return {CSSMatrix} the current transform matrix
    //  */
    // function getParentCTM ()
    // {
    //
    //   function multiplyParentTCM (parent)
    //   {
    //     // no parent return identity matrix
    //     if (!parent) return new CSSMatrix ();
    //     // apply parent transformation matrix recurcively
    //     return multiplyParentTCM (parent.parentNode).multiply (parent.vsGetCTM ());
    //   }
    //
    //   return multiplyParentTCM (this.parentNode);
    // };
    /**
     */
    applyTransformation(node) {
      var matrix = this.getCTM();
      vs_ui_utils.setElementTransform(node, matrix.toString());
    }
  }
  _transform = new WeakMap();
  _translation = new WeakMap();
  _rotation = new WeakMap();
  _scaling = new WeakMap();
  _transformOrigin = new WeakMap();

  exports.Transform = Transform;

}));
//# sourceMappingURL=vs_transform.amd.js.map
