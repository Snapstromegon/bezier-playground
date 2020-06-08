import Canvas from './helper/Canvas.js';
import Point from './Point.js';
import { default as renderCasteljau } from './renderer/Casteljau.js';
import Line from './Line.js';

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
      renderCasteljau(this.#canvas, curve, options);
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
