import { vec2, vec3 } from 'gl-matrix';
import { Matrix } from 'vs_ui_utils';

/*****************************************************************
 *                Transformation methods
 ****************************************************************/
declare class Transform {
    #private;
    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are percentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @type Array.<number>
     */
    set transformOrigin(v: vec2);
    /**
     * @ignore
     * @return {Array}
     */
    get transformOrigin(): vec2;
    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @type {Array}
     */
    set translation(v: vec3);
    /**
     * Rotation angle in degree
     * @type {float}
     */
    set rotation(v: vec3);
    /**
     * Scale the view
     * @type {float}
     */
    set scaling(v: number);
    /**
     * @ignore
     * @type {float}
     */
    get scaling(): number;
    /**
     *  Remove all previous transformations set for this view
     */
    clearTransformStack(): void;
    /**
     *  Return the current transform matrix apply to this graphic Object.
     *
     * @return {Matrix} the current transform matrix
     */
    getCTM(): Matrix;
    /**
     */
    private applyTransformation;
}

export { Transform };
