import Point from './Point.js';

export default class Curve {
  /**
   * @type {Point[]}
   */
  points = [];

  /**
   *
   * @param {Point} point
   */
  addPoint(point) {
    this.points.push(point);
  }

  serialize() {
    return this.points.map((p) => p.serialize());
  }

  get lastPoint() {
    return this.points ? this.points.slice(-1)[0] : undefined;
  }

  getPointAt(x, y, maxDistance = 10) {
    let closest;
    let closestDistance = Infinity;
    for (const point of this.points) {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = point;
      }
    }
    return closestDistance <= maxDistance ? closest : undefined;
  }

  static deserialize(raw_curve) {
    const curve = new Curve();
    for (const point of raw_curve) {
      curve.addPoint(Point.deserialize(point));
    }
    return curve;
  }
}
