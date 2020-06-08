import Curve from '../Curve.js';
import Canvas from '../helper/Canvas.js';
import Point from '../Point.js';

/**
 *
 * @param {Canvas} canvas
 * @param {Curve} curve
 * @param {{renderResolution?: number, drawMetaInfo?: boolean, highlightValue?: number}?} options
 */
export default function renderCasteljau(
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
  for (let i = 0; i <= renderResolution; i++) {
    const t = i / renderResolution;
    const tPoint = recursive(curve.points, t);
    canvas.fillCircle(tPoint.x, tPoint.y, 3, `#800a`);
  }
  const tPoint = recursive(curve.points, highlightValue);
  canvas.fillCircle(tPoint.x, tPoint.y, 5, `#f00a`);
}

/**
 *
 * @param {Point[]} points
 * @param {number} t
 */
function recursive(points, t) {
  // abbort recursion
  if (points.length <= 1) return points[0];

  // we've got at least 2 points -> reduce them
  const res = [];

  // use the first one as the first last and start the loop at the second point
  let last = points[0];

  for (const [i, current] of points.slice(1).entries()) {
    const dx = current.x - last.x;
    const dy = current.y - last.y;
    res.push(new Point(last.x + dx * t, last.y + dy * t));
    last = current;
  }
  return recursive(res, t);
}

/******************/
/* Draw Meta Info */
/******************/

function drawMeta(canvas, points, { highlightValue = 0, t = 0 } = {}) {
  if (points.length <= 1) {
    return;
  }
  const nextPoints = [];
  let last = points[0];

  for (const current of points.slice(1)) {
    canvas.drawLine(
      current.x,
      current.y,
      last.x,
      last.y,
      3,
      `hsl(${t * 45},100%,66%)`
    );
    nextPoints.push(recursive([last, current], highlightValue));
    last = current;
  }
  drawMeta(canvas, nextPoints, { highlightValue, t: t + 1 });
}
