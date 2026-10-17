import { vec2, vec3 } from 'gl-matrix';
import { Matrix, setElementTransform } from 'vs_ui_utils';
import { copyVector2, copyVector3 } from './helpers';

const HTMLElement = (window && window.HTMLElement);

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

    // this.applyTransformation(this);
  };

  /**
   * Rotation angle in degree
   * @type {float}
   */
  set rotation(v: vec3) {
    copyVector3(this.#rotation, v);

    // this.applyTransformation(this);
  };

  /**
   * Scale the view
   * @type {float}
   */
  set scaling(v: number) {
    this.#scaling = v;

    // this.applyTransformation(this);
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
    let matrix = new DOMMatrix ();

    // apply current transformation
    matrix = matrix.translate(this.#transformOrigin[0], this.#transformOrigin[1], 0);
    matrix = matrix.translate(this.#translation[0], this.#translation[1], this.#translation[2]);
    matrix = matrix.rotate(this.#rotation[0], this.#rotation[1], this.#rotation[2]);
    matrix = matrix.scale(this.#scaling, this.#scaling, 1);
    matrix = matrix.translate(-this.#transformOrigin[0], -this.#transformOrigin[1], 0);

    // apply previous transformations and return the matrix
    return (this.#transform ? matrix.multiply(this.#transform) : matrix) as Matrix;
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
   */
  private applyTransformation(node: HTMLElement) {
    var matrix = this.getCTM();

    setElementTransform(node, matrix.toString());
  };
}
