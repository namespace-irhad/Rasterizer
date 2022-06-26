// A Triangle.
class Triangle {
  constructor(indexes, color, normals, texture, uvs, bump_map = null) {
    if (!(this instanceof Triangle)) {
      return new Triangle(indexes, color, normals, texture, uvs, bump_map);
    }

    this.indexes = indexes;
    this.color = color;
    this.normals = normals;
    this.texture = texture;
    this.uvs = uvs;
    this.bump_map = bump_map;
  }
}

var DrawWireframeTriangle = function (p0, p1, p2, color) {
  DrawLine(p0, p1, color);
  DrawLine(p1, p2, color);
  DrawLine(p0, p2, color);
};
var DrawFilledTriangle = function (p0, p1, p2, color) {
  // Sort the points from bottom to top.
  if (p1.y < p0.y) {
    var swap = p0;
    p0 = p1;
    p1 = swap;
  }
  if (p2.y < p0.y) {
    var swap = p0;
    p0 = p2;
    p2 = swap;
  }
  if (p2.y < p1.y) {
    var swap = p1;
    p1 = p2;
    p2 = swap;
  }

  // Compute X coordinates of the edges.
  var x01 = Interpolate(p0.y, p0.x, p1.y, p1.x);
  var x12 = Interpolate(p1.y, p1.x, p2.y, p2.x);
  var x02 = Interpolate(p0.y, p0.x, p2.y, p2.x);

  // Merge the two short sides.
  x01.pop();
  var x012 = x01.concat(x12);

  // Determine which is left and which is right.
  var x_left, x_right;
  var m = (x02.length / 2) | 0;
  if (x02[m] < x012[m]) {
    x_left = x02;
    x_right = x012;
  } else {
    x_left = x012;
    x_right = x02;
  }

  // Draw horizontal segments.
  for (var y = p0.y; y <= p2.y; y++) {
    for (var x = x_left[y - p0.y]; x <= x_right[y - p0.y]; x++) {
      Rasterizer.putPixel(x, y, color, canvas, canvas_buffer);
    }
  }
};

var DrawShadedTriangle = function (p0, p1, p2, color, canvas_buffer) {
  // Sort the points from bottom to top.
  if (p1.y < p0.y) {
    var swap = p0;
    p0 = p1;
    p1 = swap;
  }
  if (p2.y < p0.y) {
    var swap = p0;
    p0 = p2;
    p2 = swap;
  }
  if (p2.y < p1.y) {
    var swap = p1;
    p1 = p2;
    p2 = swap;
  }
  // Compute X coordinates and H values of the edges.
  var x01 = Interpolate(p0.y, p0.x, p1.y, p1.x);
  var h01 = Interpolate(p0.y, p0.z, p1.y, p1.z);

  var x12 = Interpolate(p1.y, p1.x, p2.y, p2.x);
  var h12 = Interpolate(p1.y, p1.z, p2.y, p2.z);

  var x02 = Interpolate(p0.y, p0.x, p2.y, p2.x);
  var h02 = Interpolate(p0.y, p0.z, p2.y, p2.z);

  // Merge the two short sides.
  x01.pop();
  var x012 = x01.concat(x12);

  h01.pop();
  var h012 = h01.concat(h12);

  // Determine which is left and which is right.
  var x_left, x_right;
  var h_left, h_right;
  var m = (x02.length / 2) | 0;
  if (x02[m] < x012[m]) {
    x_left = x02;
    x_right = x012;
    h_left = h02;
    h_right = h012;
  } else {
    x_left = x012;
    x_right = x02;
    h_left = h012;
    h_right = h02;
  }

  // Draw horizontal segments.
  for (var y = p0.y; y <= p2.y; y++) {
    var xl = x_left[y - p0.y] | 0;
    var xr = x_right[y - p0.y] | 0;
    var h_segment = Interpolate(xl, h_left[y - p0.y], xr, h_right[y - p0.y]);

    for (var x = xl; x <= xr; x++) {
      Rasterizer.putPixel(x, y, Multiply(h_segment[x - xl], color), canvas, canvas_buffer);
    }
  }
};
