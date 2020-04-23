import Canvas from './class/Canvas.js';
import Bezier from './class/Bezier.js';
import Point from './class/Point.js';

const domCanvas = document.querySelector('canvas');

const c = new Canvas(domCanvas);

const bz = new Bezier(c);

/**
 * @type {Point}
 */
let tmpPoint;
let isDown = false;

domCanvas.addEventListener('mousedown', (e) => {
  tmpPoint = bz.getPointAt(e.offsetX, e.offsetY);
  isDown = true;
});

domCanvas.addEventListener('mouseup', (e) => {
  isDown = false;
});

domCanvas.addEventListener('mousemove', (e) => {
  if (isDown) {
    tmpPoint.x = e.offsetX;
    tmpPoint.y = e.offsetY;
    bz.draw();
  }
});

document.querySelector('#reset').addEventListener('click', () => bz.reset());
const modeSelector = document.querySelector('#mode');
modeSelector.addEventListener('change', (e) => bz.mode = modeSelector.value);
bz.mode = modeSelector.value;

const renderDetail = document.querySelector('#render_detail');
renderDetail.addEventListener('change', (e) => bz.renderStepCount = renderDetail.value);
bz.renderStepCount = renderDetail.value;