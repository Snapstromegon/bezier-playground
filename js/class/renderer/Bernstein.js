import Curve from '../Curve.js';
import Canvas from '../helper/Canvas.js';
import Point from '../Point.js';

/**
 *
 * @param {Canvas} ctx
 * @param {Curve} curve
 */
export default function renderBernstein(
  canvas,
  curve,
  { drawMetaInfo = false, ...options } = {}
) {
  drawCurve(canvas, curve, options);
  if (drawMetaInfo) {
    drawMeta(canvas, curve.points, options);
  }
}

/**
 *
 * @param {Canvas} canvas
 * @param {Curve} curve
 * @param {{renderResolution?: number, highlightValue?: number} = {}}
 */
function drawCurve(
  canvas,
  curve,
  { renderResolution, highlightValue = 0 } = {}
) {
  if (curve.points.length <= 1) {
    return;
  }

  const factors = bernsteinPolynomFactors(curve.points.length - 1);

  for (let i = 0; i <= renderResolution; i++) {
    const t = i / renderResolution;
    const tPoint = bernstein(curve.points, factors, t);

    canvas.fillCircle(tPoint.x, tPoint.y, 3, `#080a`);
  }

  const tPoint = bernstein(curve.points, factors, highlightValue);
  canvas.fillCircle(tPoint.x, tPoint.y, 5, `#0f0a`);
}

/**
 *
 * @param {Point[]} points
 * @param {(number=>number)[]} factors
 * @param {number} t
 */
function bernstein(points, factors, t) {
  return new Point(
    points.reduce((acc, point, i) => acc + point.x * factors[i](t), 0),
    points.reduce((acc, point, i) => acc + point.y * factors[i](t), 0)
  );
}

/**
 * This function precalculates (n over i) * t^î * (1-t)^(n-i)
 * @param {*} n
 * @returns {Array<number => number>}
 */
function bernsteinPolynomFactors(n) {
  const res = [];
  for (let i = 0; i <= n; i++) {
    const factor = aOverB(n, i);
    res.push((t) => factor * t ** i * (1 - t) ** (n - i));
  }
  return res;
}

function aOverB(a, b) {
  return fact(a) / (fact(b) * fact(a - b));
}

function fact(num) {
  let recursive = 1;
  for (let i = 2; i <= num; i++) recursive = recursive * i;
  return recursive;
}

/**
 *
 * @param {Canvas} canvas
 * @param {Point[]} points
 * @param {*} param2
 */
function drawMeta(
  canvas,
  points,
  { renderResolution = 100, highlightValue = 0, t = 0 } = {}
) {
  if (points.length <= 1) {
    return;
  }

  const factors = bernsteinPolynomFactors(points.length - 1);
  for (let i = 0; i <= renderResolution; i++) {
    const t = i / renderResolution;
    const tPoint = bernstein(points, factors, t);

    canvas.fillCircle(tPoint.x, canvas.height * (1 - t), 3, `#880a`);
    canvas.fillCircle(canvas.width * t, tPoint.y, 3, `#088a`);
  }

  const tPoint = bernstein(points, factors, highlightValue);

  canvas.drawLine(
    tPoint.x,
    tPoint.y,
    tPoint.x,
    canvas.height * (1 - highlightValue),
    1,
    '#000'
  );
  canvas.drawLine(
    tPoint.x,
    tPoint.y,
    canvas.width * highlightValue,
    tPoint.y,
    1,
    '#000'
  );

  canvas.fillCircle(tPoint.x, canvas.height * (1 - highlightValue), 5, `#8f0a`);
  canvas.fillCircle(canvas.width * highlightValue, tPoint.y, 5, `#0f8a`);
}
