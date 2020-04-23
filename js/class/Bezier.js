import Canvas from './Canvas.js';
import Point from './Point.js';

export default class Bezier {
  /**
   * @type {Array<Point>}
   */
  #points = [];

  #renderStepCount = 100;

  /**
   * @type {Canvas}
   */
  #canvas;
  #mode;
  #drawSingle = true;
  #singleDrawTime = 0.5;

  constructor(canvas) {
    this.#canvas = canvas;
  }

  set mode(mode) {
    this.#mode = mode;
    this.draw();
  }

  set renderStepCount(value) {
    this.#renderStepCount = value;
    this.draw();
  }

  set singleDrawTime(value) {
    this.#singleDrawTime = value;
    this.draw();
  }

  set drawSingle(value) {
    this.#drawSingle = value;
    this.draw();
  }

  draw() {
    this.#canvas.reset();

    if (this.#drawSingle) {
      switch (this.#mode) {
        case 'Recursive':
          this.drawRecursiveTimeState(this.#singleDrawTime);
      }
    } else {
      switch (this.#mode) {
        case 'Recursive':
          this.drawRecursive();
      }
    }
    for (
      let i = 0, point = this.#points[0];
      i < this.#points.length;
      i++, point = this.#points[i]
    ) {
      this.#canvas.fillCenteredRect(point.x, point.y, 10, 10, '#00000088');
      this.#canvas.fillText(i + 1, point.x + 10, point.y + 5);
    }
  }

  drawRecursiveTimeState(t) {
    if (this.#points.length > 1) {
      this.drawRecursiveTimeStateLines(t);
      const tPoint = this.recursive(this.#points, t);
      this.#canvas.fillCircle(tPoint.x, tPoint.y, 5, '#f00');
    }
  }

  drawRecursiveTimeStateLines(t, points = this.#points, iteration = 0) {
    if (points.length > 1) {
      const nextPoints = [];
      for (
        let last = points[0], i = 1, current = points[i];
        i < points.length;
        last = points[i], i++, current = points[i]
      ) {
        this.#canvas.drawLine(current.x, current.y, last.x, last.y, 3, `hsla(${iteration*20},100%,50%,0.5)`);
        nextPoints.push(this.recursive([last, current], t));
      }
      this.drawRecursiveTimeStateLines(t, nextPoints, iteration+1);
    }
  }

  drawRecursive() {
    if (this.#points.length > 1) {
      for (let i = 0; i <= this.#renderStepCount; i++) {
        const t = i / this.#renderStepCount;
        const tPoint = this.recursive(this.#points, t);
        this.#canvas.fillCircle(tPoint.x, tPoint.y, 5, '#f00');
      }
    }
  }

  recursive(points, t) {
    // abbort recursion
    if (points.length <= 1) return points[0];

    // we've got at least 2 points -> reduce them
    const res = [];

    for (
      let last = points[0], i = 1, current = points[i];
      i < points.length;
      last = points[i], i++, current = points[i]
    ) {
      const dx = current.x - last.x;
      const dy = current.y - last.y;
      res.push(new Point(last.x + dx * t, last.y + dy * t));
    }
    return this.recursive(res, t);
  }

  addPoint(...points) {
    this.#points.push(...points);
    this.draw();
  }

  reset() {
    this.#points = [];
    this.draw();
  }

  getPointAt(x, y, maxDistance = 10) {
    let closest;
    let closestDistance = Infinity;
    for (const point of this.#points) {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = point;
      }
    }
    if (closestDistance > maxDistance) {
      closest = new Point(x, y);
      this.addPoint(closest);
    }
    return closest;
  }
}
