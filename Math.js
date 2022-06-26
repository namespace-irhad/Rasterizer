// ======================================================================
//  Linear algebra and helpers.
// ======================================================================

// Computes k * vec.
const Multiply = (k, vec) => {
  if (vec instanceof Color) return new Color(k * vec.r, k * vec.g, k * vec.b);

  return new Vertex(k * vec.x, k * vec.y, k * vec.z);
};

// Computes dot product.
const Dot = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

// Computes cross product.
const Cross = (v1, v2) => {
  return new Vertex(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
};

// Computes v1 + v2.
const Add = (v1, v2) => {
  return new Vertex(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};

// Computes vector magnitude.
const Magnitude = (v1) => {
  return Math.sqrt(Dot(v1, v1));
};

// Makes a transform matrix for a rotation around the OY axis.
const MakeOYRotationMatrix = (degrees) => {
  const cos = Math.cos((degrees * Math.PI) / 180.0);
  const sin = Math.sin((degrees * Math.PI) / 180.0);

  return new Mat4x4([
    [cos, 0, -sin, 0],
    [0, 1, 0, 0],
    [sin, 0, cos, 0],
    [0, 0, 0, 1],
  ]);
};

// Makes a transform matrix for a translation.
const MakeTranslationMatrix = (translation) => {
  return new Mat4x4([
    [1, 0, 0, translation.x],
    [0, 1, 0, translation.y],
    [0, 0, 1, translation.z],
    [0, 0, 0, 1],
  ]);
};

// Makes a transform matrix for a scaling.
const MakeScalingMatrix = (scale) => {
  return new Mat4x4([
    [scale, 0, 0, 0],
    [0, scale, 0, 0],
    [0, 0, scale, 0],
    [0, 0, 0, 1],
  ]);
};

// Multiplies a 4x4 matrix and a 4D vector.
const MultiplyMV = (mat4x4, vec4) => {
  var result = [0, 0, 0, 0];
  var vec = [vec4.x, vec4.y, vec4.z, vec4.w];

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      result[i] += mat4x4.data[i][j] * vec[j];
    }
  }

  return new Vertex4(result[0], result[1], result[2], result[3]);
};

// Multiplies two 4x4 matrices.
const MultiplyMM4 = (matA, matB) => {
  let result = new Mat4x4([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result.data[i][j] += matA.data[i][k] * matB.data[k][j];
      }
    }
  }

  return result;
};

// Transposes a 4x4 matrix.
const Transposed = function (mat) {
  let result = new Mat4x4([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result.data[i][j] = mat.data[j][i];
    }
  }
  return result;
};

const Clamp = (value) => {
  if (value < 0) {
    return 0;
  }
  if (value > 255) {
    return 255;
  }
  return value;
};

// ======================================================================
//  Data model.
// ======================================================================

// A Point.
class Pt {
  constructor(x, y, h) {
    if (!(this instanceof Pt)) {
      return new Pt(x, y, h);
    }

    this.x = x;
    this.y = y;
    this.h = h;
  }
}

// A 3D vertex.
class Vertex {
  constructor(x, y, z) {
    if (!(this instanceof Vertex)) {
      return new Vertex(x, y, z);
    }

    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// A 4D vertex (a 3D vertex in homogeneous coordinates).
class Vertex4 {
  constructor(arg1, y, z, w) {
    if (!(this instanceof Vertex4)) {
      return new Vertex4(arg1, y, z, w);
    }

    if (arg1 instanceof Vertex) {
      this.x = arg1.x;
      this.y = arg1.y;
      this.z = arg1.z;
      this.w = 1;
    } else if (arg1 instanceof Vertex4) {
      this.x = arg1.x;
      this.y = arg1.y;
      this.z = arg1.z;
      this.w = arg1.w;
    } else {
      this.x = arg1;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  }
}

// A 4x4 matrix.
class Mat4x4 {
  constructor(data) {
    if (!(this instanceof Mat4x4)) {
      return new Mat4x4(data);
    }

    this.data = data;
  }
}

const Identity4x4 = new Mat4x4([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]);
