/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
 
 Use code from Canto.js Copyright 2010 Steven Levithan <stevenlevithan.com>
*/

(function (exports) {

  var
    util = (exports && exports.util),
    CSSMatrix = (util && util.CSSMatrix);
    
  /**
   *  @class
   *  vs.Point is an (x, y) coordinate pair. 
   *  When you use an vs.Point object in matrix operations, the object is 
   *  treated as a vector of the following form <x, y, 1>
   *
   * @author David Thevenin
   *
   *  @constructor
   *  Main constructor
   *
   * @name vs.Point
   *
   * @param {Number} the x-coordinate value.
   * @param {Number} the y-coordinate value.
  */
  function Point (x, y)
  {
//    if (util.isNumber (x))
      this.x = x;
//    if (util.isNumber (y))
      this.y = y;
  }

  Point.prototype = {

    /*****************************************************************
     *
     ****************************************************************/
   
     x: 0,
     y: 0,
  
    /*****************************************************************
     *              
     ****************************************************************/
   
    /**
     * Applies the given 2×3 matrix transformation on this Point object and 
     * returns a new, transformed Point object.
     *
     * @name vs.Point#matrixTransform
     * @function
     * @public
     * @param {vs.CSSMatrix} matrix he matrix
     * @returns {vs.Point} the matrix
     */
    matrixTransform : function (matrix)
    {
      var matrix_tmp = new CSSMatrix ();

      matrix_tmp = matrix_tmp.translate (this.x, this.y, this.z || 0);
      matrix = matrix.multiply (matrix_tmp);

      var result = new Point (matrix.m41, matrix.m42);

      delete (matrix_tmp);
      delete (matrix);

      return result;
    }
  };

  /********************************************************************
                        Export
  *********************************************************************/
  util.Point = Point;
}) (window);(function (exports) {

  var
    util = (exports && exports.util),
    CSSMatrix = (util && util.CSSMatrix),
    HTMLElement = (exports && exports.HTMLElement);

  /*****************************************************************
   *                Transformation methods
   ****************************************************************/
   
  /**
   *  Move the view in x, y.
   * 
   * @param x {int} translation over the x axis
   * @param y {int} translation over the y axis
   */
  function translate (x, y)
  {
    if (this._vs_node_tx === x && this._vs_node_ty === y) { return; }
    
    this._vs_node_tx = x;
    this._vs_node_ty = y;
    
    applyTransformation (this);
  };
  
  /**
   *  Rotate the view about the horizontal and vertical axes.
   *  <p/>The angle units is radians.
   * 
   * @param r {float} rotion angle
   */
  function rotate (r)
  {
    if (this._vs_node_r === r) { return; }
    
    this._vs_node_r = r;
    
    applyTransformation (this);
  };

  /**
   *  Scale the view
   *  <p/>The scale is limited by a max and min scale value.
   * 
   * @param s {float} scale value
   */
  function scale (s)
  {    
    if (this._vs_node_s === s) { return; }
 
    this._vs_node_s = s;
    
    applyTransformation (this);
  };

  /**
   *  Define a new transformation matrix, using the transformation origin 
   *  set as parameter.
   *
   * @param {Point} origin is a object reference a x and y position
   */
  function setNewTransformOrigin (origin)
  {
    if (!origin) { return; }
//    if (!util.isNumber (origin.x) || !util.isNumber (origin.y)) { return; }
    if (!this._vs_node_origin) this._vs_node_origin = [0, 0];

    // Save current transform into a matrix
    var matrix = new CSSMatrix ();
    matrix = matrix.translate
      (this._vs_node_origin [0], this._vs_node_origin [1], 0);
    matrix = matrix.translate (this._vs_node_tx, this._vs_node_ty, 0);
    matrix = matrix.rotate (0, 0, this._vs_node_r);
    matrix = matrix.scale (this._vs_node_s, this._vs_node_s, 1);
    matrix = matrix.translate
      (-this._vs_node_origin [0], -this._vs_node_origin [1], 0);

    if (!this._vs_transform) this._vs_transform = matrix;
    {
      this._vs_transform = matrix.multiply (this._vs_transform);
      delete (matrix);
    }
    
    // Init a new transform space
    this._vs_node_tx = 0;
    this._vs_node_ty = 0;
    this._vs_node_s = 1;
    this._vs_node_r = 0;
    
    this._vs_node_origin = [origin.x, origin.y];
  };

  
  /**
   *  Remove all previous transformations set for this view
   */
  function clearTransformStack ()
  {
    if (this._vs_transform) delete (this._vs_transform);
    this._vs_transform = undefined;
  };
  
  /**
   *  Return the current transform matrix apply to this graphic Object.
   *
   * @return {CSSMatrix} the current transform matrix
   */
  function getCTM ()
  {
    var matrix = new CSSMatrix (), transform, matrix_tmp;
    if (!this._vs_node_origin) this._vs_node_origin = [0, 0];
    
    // apply current transformation
    matrix = matrix.translate (this._vs_node_origin [0], this._vs_node_origin [1], 0);
    matrix = matrix.translate (this._vs_node_tx, this._vs_node_ty, 0);
    matrix = matrix.rotate (0, 0, this._vs_node_r);
    matrix = matrix.scale (this._vs_node_s, this._vs_node_s, 1);
    matrix = matrix.translate (-this._vs_node_origin [0], -this._vs_node_origin [1], 0);    

    
    // apply previous transformations and return the matrix
    if (this._vs_transform) return matrix.multiply (this._vs_transform);
    else return matrix;
  };
  
  /**
   *  Returns the current transform combination matrix generate by the
   *  hierarchical parents of this graphic Object.
   *  Its returns the multiplication of the parent's CTM and parent of parent's
   *  CTM etc.
   *  If the component has no parent it returns the identity matrix.
   * 
   * @return {CSSMatrix} the current transform matrix
   */
  function getParentCTM ()
  {
    
    function multiplyParentTCM (parent)
    {
      // no parent return identity matrix
      if (!parent) return new CSSMatrix ();
      // apply parent transformation matrix recurcively 
      return multiplyParentTCM (parent.parentNode).multiply (parent.vsGetCTM ());
    }
    
    return multiplyParentTCM (this.parentNode);
  };

  /**
   */
  function applyTransformation (node)
  {
    var matrix = node.vsGetCTM ();
    
    util.setElementTransform (node, matrix.toString ());
    delete (matrix);
  };
  
  util.extend (HTMLElement.prototype, {
    _vs_node_tx:                  0,
    _vs_node_ty:                  0,
    _vs_node_s:              1,
    _vs_node_r:             0,
    vsTranslate:                   translate,
    vsRotate:                      rotate,
    vsScale:                       scale,
    vsSetNewTransformOrigin:       setNewTransformOrigin,
    vsClearTransformStack:         clearTransformStack,
    vsGetCTM:                      getCTM,
    vsGetParentCTM:                getParentCTM
  });

}) (window);