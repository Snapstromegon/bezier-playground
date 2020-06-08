import Curve from './Curve.js';

export default class Line {
  /**
   * @type {Curve[]}
   */
  curves = [];

  /**
   * @type {number}
   */
  maxPointsPerCurve;

  constructor({ maxPointsPerCurve = 4 } = {}) {
    this.maxPointsPerCurve = maxPointsPerCurve;
  }

  get lastCurve() {
    return this.curves ? this.curves.slice(-1)[0] : undefined;
  }

  /**
   *
   * @param {Point} point
   */
  addPoint(point) {
    const lastCurve = this.lastCurve;

    let curve = lastCurve;
    if (!lastCurve || lastCurve.points.length >= this.maxPointsPerCurve) {
      curve = new Curve();
      if (lastCurve) {
        curve.addPoint(this.lastCurve.lastPoint);
      }
      this.curves.push(curve);
    }

    curve.addPoint(point);
  }

  getPointAt(x, y, maxDistance = 10) {
    let closest;
    let closestDistance = Infinity;
    for (const point of this.curves
      .map((c) => c.getPointAt(x, y, maxDistance))
      .filter(Boolean)) {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = point;
      }
    }
    return closest;
  }
}
