// ======================================================================
//  Low-level canvas access.
// ======================================================================

const canvas = document.getElementById('canvas');
const canvas_context = canvas.getContext('2d');
const canvas_buffer = canvas_context.getImageData(0, 0, canvas.width, canvas.height);

// ======================================================================
//  Rasterizer.
// ======================================================================

// ======================================================================
//  Depth buffer.
// ======================================================================
let depth_buffer = [];
depth_buffer.length = canvas.width * canvas.height;

class Rasterizer {
  static updatePixelCoordinates(x, y, canvas) {
    x = canvas.width / 2 + (x | 0);
    y = canvas.height / 2 - (y | 0) - 1;

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      return [-1, -1];
    }

    return [x, y];
  }

  static putPixel = (x, y, color, canvas, canvas_buffer) => {
    const [newX, newY] = Rasterizer.updatePixelCoordinates(x, y, canvas);
    if (newX === -1) return;

    let pomak = 4 * (newX + canvas.width * newY);
    canvas_buffer.data[pomak++] = color.r;
    canvas_buffer.data[pomak++] = color.g;
    canvas_buffer.data[pomak++] = color.b;
    canvas_buffer.data[pomak++] = color.a;
  };

  static updateCanvas = (canvas_context, canvas_buffer) => {
    canvas_context.putImageData(canvas_buffer, 0, 0);
  };

  static UpdateDepthBufferIfCloser = (x, y, inv_z) => {
    const [newX, newY] = Rasterizer.updatePixelCoordinates(x, y, canvas);
    if (newX === -1) return false;

    let pomak = newX + canvas.width * newY;
    if (depth_buffer[pomak] == undefined || depth_buffer[pomak] < inv_z) {
      depth_buffer[pomak] = inv_z;
      return true;
    }
    return false;
  };

  static ClearAll = () => {
    canvas.width = canvas.width;
    depth_buffer = [];
    depth_buffer.length = canvas.width * canvas.height;
  };
}
