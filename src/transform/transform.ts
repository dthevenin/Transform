import { vec2, vec3 } from 'gl-matrix';
import { Matrix, setElementTransform } from 'vs_ui_utils';
import { copyVector2, copyVector3 } from './helpers';

/*****************************************************************
 *                Transformation methods
 ****************************************************************/
export class Transform {

  #transform: Matrix | undefined;

  /**
   * Translation vector [tx, ty]
   * <=> obj.translate (tx, ty)
   * @type {Array}
   */
  #translation = vec3.create();

  /**
   * Rotation angle in degree
   * @type {float}
   */
  #rotation = vec3.create();

  #scaling = 1;

  /**
   * Transformation center (origin)
   * @protected
   * @type {vec2}
   */
  #transformOrigin = vec2.create();

  /**
   * This property allows you to specify the origin of the 2D transformations.
   * Values are percentage of the view size.
   * <p>
   * The property is set by default to [50, 50], which is the center of
   * the view.
   * @type Array.<number>
   */
  set transformOrigin(v: vec2) {
    if (v.length !== 2) { return; }

    // Save current transform into a matrix, using the previous origin
    this.#transform = this.getCTM();

    copyVector2(this.#transformOrigin, v);

    // Init a new transform space
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
  get transformOrigin(): vec2 {
    return vec2.fromValues(this.#transformOrigin[0], this.#transformOrigin[1]);
  }

  /**
   * Translation vector [tx, ty]
   * <=> obj.translate (tx, ty)
   * @type {Array}
   */
  set translation(v: vec3) {
    if (v.length !== 3) { return; }

    copyVector3(this.#translation, v);
  };

  /**
   * Rotation angle in degree
   * @type {float}
   */
  set rotation(v: vec3) {
    copyVector3(this.#rotation, v);
  };

  /**
   * Scale the view
   * @type {float}
   */
  set scaling(v: number) {
    this.#scaling = v;
  };

  /**
   * @ignore
   * @type {float}
   */
  get scaling(): number {
    return this.#scaling;
  }

  /**
   *  Remove all previous transformations set for this view
   */
  clearTransformStack() {
    this.#transform = undefined;
  };

  /**
   *  Return the current transform matrix apply to this graphic Object.
   *
   * @return {Matrix} the current transform matrix
   */
  getCTM(): Matrix {
    // DOMMatrix non-Self methods return a plain DOMMatrix, so mutate in place
    // to keep the Matrix subclass
    const matrix = new Matrix();

    // apply current transformation
    matrix.translateSelf(this.#transformOrigin[0], this.#transformOrigin[1], 0);
    matrix.translateSelf(this.#translation[0], this.#translation[1], this.#translation[2]);
    matrix.rotateSelf(this.#rotation[0], this.#rotation[1], this.#rotation[2]);
    matrix.scaleSelf(this.#scaling, this.#scaling, 1);
    matrix.translateSelf(-this.#transformOrigin[0], -this.#transformOrigin[1], 0);

    // apply previous transformations and return the matrix
    if (this.#transform) { matrix.multiplySelf(this.#transform); }
    return matrix;
  };

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
   *  Apply the current transform matrix to the given element.
   */
  applyTransformation(node: HTMLElement) {
    const matrix = this.getCTM();

    setElementTransform(node, matrix.toString());
  };
}
