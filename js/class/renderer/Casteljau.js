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

  for (const [i, point] of curve.points.entries()) {
    canvas.fillCenteredRect(point.x, point.y, 10, 10, '#00000088');
    canvas.fillText(i + 1, point.x + 10, point.y + 5);
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
  if (curve.points.length > 1) {
    for (let i = 0; i <= renderResolution; i++) {
      const t = i / renderResolution;
      const tPoint = recursive(curve.points, t)[0];
      canvas.fillCircle(
        tPoint.x,
        tPoint.y,
        isHighlightedValue(highlightValue, i, renderResolution) ? 5 : 3,
        `#${
          isHighlightedValue(highlightValue, i, renderResolution) ? 'f' : 'a'
        }00a`
      );
    }
  }
}

function isHighlightedValue(target, i, resolution) {
  const dLower = Math.abs(target - (i == 0 ? Infinity : (i - 1) / resolution));
  const dUpper = Math.abs(target - (i == 0 ? Infinity : (i + 1) / resolution));
  const dSelf = Math.abs(target - i / resolution);
  return dSelf < dLower && dSelf < dUpper;
}

/**
 *
 * @param {Point[]} points
 * @param {number} t
 */
function recursive(points, t) {
  // abbort recursion
  if (points.length <= 1) return points.slice();

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

function drawMeta(canvas, points, { highlightValue = 0, iteration = 0 } = {}) {
  if (points.length > 1) {
    const nextPoints = [];
    let last = points[0];

    for (const current of points.slice(1)) {
      canvas.drawLine(
        current.x,
        current.y,
        last.x,
        last.y,
        3,
        `hsla(${iteration * 20},100%,75%,0.5)`
      );
      nextPoints.push(recursive([last, current], highlightValue)[0]);
      last = current;
    }
    drawMeta(canvas, nextPoints, { highlightValue, iteration: iteration + 1 });
  }
}
