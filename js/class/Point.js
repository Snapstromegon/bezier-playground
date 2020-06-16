export default class Point {
  /**
   * @type {Number}
   */
  x;

  /**
   * @type {Number}
   */
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  duplicate() {
    return new Point(this.x, this.y);
  }

  serialize() {
    return { x: this.x, y: this.y };
  }

  static deserialize(point) {
    return new Point(point.x, point.y);
  }
}
