export default class Canvas {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;

  /**
   * @type {CanvasRenderingContext2D}
   */
  #ctx;

  /**
   * @type {ResizeObserver}
   */
  #resizeObserver;

  constructor(domCanvas) {
    this.#canvas = domCanvas;
    this.#ctx = this.#canvas.getContext('2d');

    this.resize();

    this.#resizeObserver = new ResizeObserver(() => this.resize());
    this.#resizeObserver.observe(this.#canvas);
  }

  resize() {
    const buffer = this.#ctx.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
    const bcr = this.#canvas.getBoundingClientRect();
    this.#canvas.width = bcr.width;
    this.#canvas.height = bcr.height;
    this.#ctx.putImageData(buffer, 0, 0);
  }

  get width() {
    return this.#canvas.width;
  }

  get height() {
    return this.#canvas.height;
  }

  reset() {
    this.#ctx.clearRect(0, 0, c.width, c.height);
  }

  fillCircle(cx, cy, r, color = '#000000') {
    this.#ctx.beginPath();
    this.#ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    this.#ctx.fillStyle = color;
    this.#ctx.fill();
  }

  fillCenteredRect(cx, cy, w, h, color = '#000000') {
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  }

  fillText(
    text,
    x,
    y,
    color = '#000000',
    font = '12px Arial',
    textAlign = 'start'
  ) {
    this.#ctx.fillStyle = color;
    this.#ctx.font = font;
    this.#ctx.textAlign = textAlign;
    this.#ctx.fillText(text, x, y);
  }

  strokeText(
    text,
    x,
    y,
    color = '#000000',
    lineWidth = 1,
    font = '12px Arial',
    textAlign = 'start'
  ) {
    this.#ctx.strokeStyle = color;
    this.#ctx.lineWidth = lineWidth;
    this.#ctx.font = font;
    this.#ctx.textAlign = textAlign;
    this.#ctx.strokeText(text, x, y);
  }

  drawLine(x1, y1, x2, y2, width, color = '#000') {
    this.#ctx.strokeStyle = color;
    this.#ctx.beginPath();
    this.#ctx.lineWidth = width;
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.stroke();
  }
}
