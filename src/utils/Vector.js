export default class Vector {

  static equals(c1, c2) {
    return c1.x === c2.x && c1.y === c2.y;
  }

  static scale(v, scale) {
    return {x: v.x * scale, y: v.y * scale};
  }

  static add(v1, v2) {
    return {x: v1.x + v2.x, y: v1.y + v2.y};
  }

  static sub(v1, v2) {
    return {x: v1.x - v2.x, y: v1.y - v2.y};
  }

  static fromTo(from, to) {
    return {x: to.x - from.x, y: to.y - from.y};
  }

  static magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static distance(p1, p2) {
    return Vector.magnitude(Vector.fromTo(p1, p2));
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static fromSVGLine(line) {
    return Vector.fromTo(
      {x: +line.getAttribute('x1'), y: +line.getAttribute('y1')},
      {x: +line.getAttribute('x2'), y: +line.getAttribute('y2')},
    );
  }
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
