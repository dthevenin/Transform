/**
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c) All rights reserved
  
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
*/

/********************************************************************
                   
*********************************************************************/

(function (exports) {

  var
    window = exports,
    document = (window && window.document),
    FirminCSSMatrix = exports.FirminCSSMatrix;

  /**
   *  @private
   */
  var util = {};
  
  /**
   * Create our "vsTest" element and style that we do most feature tests on.
   * @private
   */
  var vsTestElem =
    (document && document.createElement)?document.createElement ('vstestelem'):null;

  /**
   * @private
   */
  var vsTestStyle = (vsTestElem)?vsTestElem.style:null;

  if (vsTestStyle)
  {
    if (vsTestStyle.webkitTransform !== undefined)
      util.SUPPORT_3D_TRANSFORM =
        'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix ();
      
    else if (vsTestStyle.MozTransform !== undefined) 
      util.SUPPORT_3D_TRANSFORM = 'MozPerspective' in vsTestStyle;

    else if (vsTestStyle.msTransform !== undefined) 
      util.SUPPORT_3D_TRANSFORM =
       'MSCSSMatrix' in window && 'm11' in new MSCSSMatrix ();

    util.CSS_VENDOR = (function () {
      var vendors = ['MozT', 'msT', 'OT', 'webkitT', 't'],
        transform,
        l = vendors.length;

      while (--l) {
        transform = vendors[l] + 'ransform';
        if ( transform in vsTestStyle ) return vendors[l].substr(0, vendors[l].length-1);
      }

      return null;
    })();
  }

  util.SUPPORT_CSS_TRANSFORM = (util.CSS_VENDOR !== null) ? true : false;

  /**
   * Represents a 4×4 homogeneous matrix that enables Document Object Model (DOM)
   * scripting access to Cascading Style Sheets (CSS) 2-D and 3-D Transforms
   * functionality.
   * @public
   * @memberOf vs
   */
  util.CSSMatrix = ('WebKitCSSMatrix' in window)?window.WebKitCSSMatrix:
    ('MSCSSMatrix' in window)?window.MSCSSMatrix:FirminCSSMatrix;

  /**
   * Tells the browser that you wish to perform an animation and requests
   * that the browser schedule a repaint of the window for the next animation
   * frame. The method takes as an argument a callback to be invoked before
   * the repaint.
   *
   * @public
   * @function
   * @memberOf vs
   *
   * @param {Function} callback A parameter specifying a function to call
   *        when it's time to update your animation for the next repaint.
   */
  util.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) { window.setTimeout (callback, 1000 / 60); };

  util.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    clearTimeout;
  
  /**
   *@private
   */
  function setElementWebkitTransform (elem, transform)
  {
    if (elem && elem.style) elem.style.webkitTransform = transform;
    else console.warn ("setElementTransform, elem null or without style");
  }

  /**
   *@private
   */
  function getElementWebkitTransform (elem, transform)
  {
    if (elem) return window.getComputedStyle (elem).webkitTransform;
  }

  /**
   *@private
   */
  function setElementMSTransform (elem, transform)
  {
    if (elem && elem.style) elem.style.msTransform = transform;
    else console.warn ("setElementTransform, elem null or without style");
  }

  /**
   *@private
   */
  function getElementMSTransform (elem, transform)
  {
    if (elem) return window.getComputedStyle (elem).msTransform;
  }

  /**
   *@private
   */
  function setElementMozTransform (elem, transform)
  {
    if (elem && elem.style) elem.style.MozTransform = transform;
    else console.warn ("setElementTransform, elem null or without style");
  }

  /**
   *@private
   */
  function getElementMozTransform (elem, transform)
  {
    if (elem) return window.getComputedStyle (elem).MozTransform;
  }

  /** 
   *  Set the CSS transformation to a element
   *
   * @param {Element} elem The element
   * @param {String} transform css transformations
   **/

  /** 
   *  get the CSS transformation to a element
   *
   * @param {Element} elem The element
   * @return {Transform} transform css transformations
   **/

  if (vsTestStyle && vsTestStyle.webkitTransform !== undefined)
  {
    util.setElementTransform = setElementWebkitTransform;
    util.getElementTransform = getElementWebkitTransform;
  }  
  else if (vsTestStyle && vsTestStyle.msTransform !== undefined)
  {
    util.setElementTransform = setElementMSTransform;
    util.getElementTransform = getElementMSTransform;
  }
  else if (vsTestStyle && vsTestStyle.MozTransform !== undefined)
  {
    util.setElementTransform = setElementMozTransform;
    util.getElementTransform = getElementMozTransform;
  }
  
  /********************************************************************

  *********************************************************************/

  /**
   * extend with __defineSetter__/__defineGetter__ compatible API
   *
   * @private
   */
  function _extend_api1 (destination, source)
  {
    for (var property in source)
    {
      getter = source.__lookupGetter__ (property);
      setter = source.__lookupSetter__ (property);

      if (getter)
      {
        destination.__defineGetter__ (property, getter)
      }
      if (setter)
      {
        destination.__defineSetter__ (property, setter)
      }
      if (!getter && !setter)
      {
        destination [property] = source [property];
      }
    }
    return destination;
  }

  /**
   * extend with Object.defineProperty compatible API
   *
   * @private
   */
  function _extend_api2 (destination, source)
  {
    for (var property in source)
    {
      var desc = Object.getOwnPropertyDescriptor (source, property);
    
      if (desc && (desc.get || desc.set))
      {
        util.defineProperty (destination, property, desc);
      }
      else
      {
        destination [property] = source [property];
      }
    }
    return destination;
  }

  /**
   * Copies all properties from the source to the destination object.
   *
   * @param {Object} destination The object to receive the new properties.
   * @param {Object} source The object whose properties will be duplicated.
   **/
  util.extend = (Object.defineProperty)?_extend_api2:_extend_api1;

  exports.util = util;
}) (window);