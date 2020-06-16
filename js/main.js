import Canvas from './class/helper/Canvas.js';
import Bezier from './class/Bezier.js';
import Point from './class/Point.js';
import Line from './class/Line.js';

const domCanvas = document.querySelector('#c');

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
  updatePoints();
});

domCanvas.addEventListener('mouseup', (e) => {
  isDown = false;
  updatePoints();
});

domCanvas.addEventListener('mousemove', (e) => {
  if (isDown) {
    tmpPoint.x = e.offsetX;
    tmpPoint.y = e.offsetY;
    bz.draw();
    updatePoints();
  }
});

function updatePoints() {
  const serialized = bz.line.serialize();
  document.querySelector('#points').value = JSON.stringify(
    serialized,
    undefined,
    4
  );
  window.location.hash = JSON.stringify(serialized);
}

function setPointsFromString(s) {
  try {
    bz.line = Line.deserialize(JSON.parse(s));
    console.log(bz.line)
    bz.draw();
    updatePoints();
  } catch (e) {
    console.error(e);
  }
}

document.querySelector('#reset').addEventListener('click', () => {
  bz.reset()
  updatePoints()
});
const modeSelector = document.querySelector('#mode');
modeSelector.addEventListener('change', (e) => (bz.mode = modeSelector.value));
bz.mode = modeSelector.value;

const renderDetail = document.querySelector('#render_detail');
renderDetail.addEventListener(
  'change',
  (e) => (bz.renderStepCount = renderDetail.value)
);
renderDetail.addEventListener(
  'input',
  (e) => (bz.renderStepCount = renderDetail.value)
);
bz.renderStepCount = renderDetail.value;

const drawSingle = document.querySelector('#draw_single');
drawSingle.addEventListener(
  'change',
  (e) => (bz.drawSingle = drawSingle.checked)
);
bz.drawSingle = drawSingle.checked;

const singlePosition = document.querySelector('#single_position');
singlePosition.addEventListener(
  'change',
  (e) => (bz.singleDrawTime = singlePosition.value)
);
singlePosition.addEventListener(
  'input',
  (e) => (bz.singleDrawTime = singlePosition.value)
);
bz.singleDrawTime = singlePosition.value;

setPointsFromString(decodeURI(window.location.hash).substr(1))

document.querySelector('#points').addEventListener('change', (e) => {
  setPointsFromString(e.target.value);
});