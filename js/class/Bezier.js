import Canvas from './helper/Canvas.js';
import Point from './Point.js';
import renderCasteljau from './renderer/Casteljau.js';
import Line from './Line.js';
import renderBernstein from './renderer/Bernstein.js';

export default class Bezier {
  /**
   * @type {Line}
   */
  line;

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
    this.line = new Line({ maxPointsPerCurve: 4 });
  }

  set mode(mode) {
    this.#mode = mode;
    this.draw();
  }

  set renderStepCount(value) {
    this.#renderStepCount = parseInt(value);
    this.draw();
  }

  set singleDrawTime(value) {
    this.#singleDrawTime = parseFloat(value);
    this.draw();
  }

  set drawSingle(value) {
    this.#drawSingle = value;
    this.draw();
  }

  draw() {
    this.#canvas.reset();
    const options = {
      renderResolution: this.#renderStepCount,
      drawMetaInfo: this.#drawSingle,
      highlightValue: this.#singleDrawTime,
    };
    for (const curve of this.line.curves) {
      switch (this.#mode) {
        default:
        case 'Recursive':
          renderCasteljau(this.#canvas, curve, options);
          break;
        case 'Bernstein':
          renderBernstein(this.#canvas, curve, options);
          break;
      }
    }

    for (const [i, point] of this.line.points.entries()) {
      this.#canvas.fillCenteredRect(point.x, point.y, 10, 10, '#00000088');
      this.#canvas.fillText(i + 1, point.x + 10, point.y + 5);
    }
  }

  addPoint(...points) {
    this.line.addPoint(...points);
    this.draw();
  }

  reset() {
    this.line.curves = [];
    this.draw();
  }

  getPointAt(x, y, maxDistance = 10) {
    let closest = this.line.getPointAt(x, y, maxDistance);
    if (!closest) {
      closest = new Point(x, y);
      this.addPoint(closest);
    }
    return closest;
  }
}
