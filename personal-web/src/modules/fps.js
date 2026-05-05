/**
 * FPS Counter — Displays real-time frames per second on screen.
 */
export function initFPS() {
  const fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  fpsElement.style.zIndex = '10000';
  fpsElement.style.position = 'fixed';
  fpsElement.style.left = '0';
  document.body.insertBefore(fpsElement, document.body.firstChild);

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    ((callback) => window.setTimeout(callback, 1000 / 60));

  let fps = 0;
  let last = Date.now();
  let offset;
  let appendFps;

  function step() {
    offset = Date.now() - last;
    fps += 1;

    if (offset >= 1000) {
      last += offset;
      appendFps(fps);
      fps = 0;
    }

    requestAnimationFrame(step);
  }

  appendFps = (fpsValue) => {
    fpsElement.textContent = 'FPS: ' + fpsValue;
  };

  step();
}
