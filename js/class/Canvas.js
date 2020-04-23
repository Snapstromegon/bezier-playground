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

    this.#resizeObserver = new ResizeObserver(() => this.resize());
    this.#resizeObserver.observe(this.#canvas);
  }

  resize() {
    const bcr = this.#canvas.getBoundingClientRect();
    this.#canvas.width = bcr.width;
    this.#canvas.height = bcr.height;
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

  fillText(text, x, y, color = '#000000') {
    this.#ctx.fillStyle = color;
    this.#ctx.fillText(text, x, y);
  }
}
