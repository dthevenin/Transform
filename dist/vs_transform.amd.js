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

  class Transform {
    #transform;
    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @type {Array}
     */
    #translation = glMatrix.vec3.create();
    /**
     * Rotation angle in degree
     * @type {float}
     */
    #rotation = glMatrix.vec3.create();
    #scaling = 1;
    /**
     * Transformation center (origin)
     * @protected
     * @type {vec2}
     */
    #transformOrigin = glMatrix.vec2.create();
    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are pourcentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @type Array.<number>
     */
    set transformOrigin(v) {
      if (v.length !== 2) {
        return;
      }
      copyVector2(this.#transformOrigin, v);
      var matrix = new DOMMatrix();
      matrix = matrix.translate(this.#transformOrigin[0], this.#transformOrigin[1], 0);
      matrix = matrix.translate(this.#translation[0], this.#translation[1], this.#translation[2]);
      matrix = matrix.rotate(this.#rotation[0], this.#rotation[1], this.#rotation[2]);
      matrix = matrix.scale(this.#scaling, this.#scaling, 1);
      matrix = matrix.translate(-this.#transformOrigin[0], -this.#transformOrigin[1], 0);
      this.#transform = this.#transform ? matrix.multiply(this.#transform) : matrix;
      this.#translation[0] = 0;
      this.#translation[1] = 0;
      this.#translation[2] = 0;
      this.#rotation[0] = 0;
      this.#rotation[1] = 0;
      this.#rotation[2] = 0;
      this.#scaling = 1;
    }
    /**
     * @ignore
     * @return {Array}
     */
    get transformOrigin() {
      return [this.#transformOrigin[0], this.#transformOrigin[1]];
    }
    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @type {Array}
     */
    set translation(v) {
      if (v.length !== 2 && v.length !== 3) {
        return;
      }
      copyVector3(this.#translation, v);
    }
    /**
     * Rotation angle in degree
     * @type {float}
     */
    set rotation(v) {
      copyVector3(this.#rotation, v);
    }
    /**
     * Scale the view
     * @type {float}
     */
    set scaling(v) {
      this.#scaling = v;
    }
    /**
     * @ignore
     * @type {float}
     */
    get scaling() {
      return this.#scaling;
    }
    /**
     *  Remove all previous transformations set for this view
     */
    clearTransformStack() {
      this.#transform = void 0;
    }
    /**
     *  Return the current transform matrix apply to this graphic Object.
     *
     * @return {Matrix} the current transform matrix
     */
    getCTM() {
      let matrix = new DOMMatrix();
      matrix = matrix.translate(this.#transformOrigin[0], this.#transformOrigin[1], 0);
      matrix = matrix.translate(this.#translation[0], this.#translation[1], this.#translation[2]);
      matrix = matrix.rotate(this.#rotation[0], this.#rotation[1], this.#rotation[2]);
      matrix = matrix.scale(this.#scaling, this.#scaling, 1);
      matrix = matrix.translate(-this.#transformOrigin[0], -this.#transformOrigin[1], 0);
      return this.#transform ? matrix.multiply(this.#transform) : matrix;
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

  exports.Transform = Transform;

}));
//# sourceMappingURL=vs_transform.amd.js.map
