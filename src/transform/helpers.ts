import { vec2, vec3 } from 'gl-matrix';

export function copyVector2(target: vec2, source: vec2) {
  target[0] = isNaN(source[0]) ? 0 : source[0];
  target[1] = isNaN(source[1]) ? 0 : source[1];
}

export function copyVector3(target: vec3, source: vec3) {
  target[0] = isNaN(source[0]) ? 0 : source[0];
  target[1] = isNaN(source[1]) ? 0 : source[1];
  target[2] = isNaN(source[2]) ? 0 : source[2];
}
