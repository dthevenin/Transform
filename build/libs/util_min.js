(function(f){function g(b,a){b&&b.style?b.style.webkitTransform=a:console.warn("setElementTransform, elem null or without style")}function h(b){if(b)return a.getComputedStyle(b).webkitTransform}function i(b,a){b&&b.style?b.style.msTransform=a:console.warn("setElementTransform, elem null or without style")}function j(b){if(b)return a.getComputedStyle(b).msTransform}function k(b,a){b&&b.style?b.style.MozTransform=a:console.warn("setElementTransform, elem null or without style")}function l(b){if(b)return a.getComputedStyle(b).MozTransform}
function m(b,a){for(var c in a)getter=a.__lookupGetter__(c),setter=a.__lookupSetter__(c),getter&&b.__defineGetter__(c,getter),setter&&b.__defineSetter__(c,setter),!getter&&!setter&&(b[c]=a[c]);return b}function n(b,a){for(var d in a){var e=Object.getOwnPropertyDescriptor(a,d);e&&(e.get||e.set)?c.defineProperty(b,d,e):b[d]=a[d]}return b}var a=f,e=a&&a.document,o=f.FirminCSSMatrix,c={},d=(e=e&&e.createElement?e.createElement("vstestelem"):null)?e.style:null;d&&(void 0!==d.webkitTransform?c.SUPPORT_3D_TRANSFORM=
"WebKitCSSMatrix"in a&&"m11"in new WebKitCSSMatrix:void 0!==d.MozTransform?c.SUPPORT_3D_TRANSFORM="MozPerspective"in d:void 0!==d.msTransform&&(c.SUPPORT_3D_TRANSFORM="MSCSSMatrix"in a&&"m11"in new MSCSSMatrix),c.CSS_VENDOR=function(){for(var a=["MozT","msT","OT","webkitT","t"],c,e=a.length;--e;)if(c=a[e]+"ransform",c in d)return a[e].substr(0,a[e].length-1);return null}());c.SUPPORT_CSS_TRANSFORM=null!==c.CSS_VENDOR?!0:!1;c.CSSMatrix="WebKitCSSMatrix"in a?a.WebKitCSSMatrix:"MSCSSMatrix"in a?a.MSCSSMatrix:
o;c.requestAnimationFrame=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(b){a.setTimeout(b,1E3/60)};c.cancelRequestAnimationFrame=a.cancelRequestAnimationFrame||a.webkitCancelAnimationFrame||a.mozCancelAnimationFrame||a.oCancelAnimationFrame||a.msCancelAnimationFrame||clearTimeout;d&&void 0!==d.webkitTransform?(c.setElementTransform=g,c.getElementTransform=h):d&&void 0!==d.msTransform?(c.setElementTransform=
i,c.getElementTransform=j):d&&void 0!==d.MozTransform&&(c.setElementTransform=k,c.getElementTransform=l);c.extend=Object.defineProperty?n:m;f.util=c})(window);
