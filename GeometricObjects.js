// A Model.
const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};
class Model {
  constructor(vertices, triangles, bounds_center, bounds_radius) {
    if (!(this instanceof Model)) {
      return new Model(vertices, triangles, bounds_center, bounds_radius);
    }
    this.vertices = vertices;
    this.triangles = triangles;
    this.bounds_center = bounds_center;
    this.bounds_radius = bounds_radius;
  }
}

// An Instance.
class Instance {
  constructor(model, position, orientation, scale) {
    if (!(this instanceof Instance)) {
      return new Instance(model, position, orientation, scale);
    }

    this.id = generateId();
    this.model = model;
    this.position = position;
    this.orientation = orientation || Identity4x4;
    this.scale = scale || 1.0;

    this.transform = MultiplyMM4(
      MakeTranslationMatrix(this.position),
      MultiplyMM4(this.orientation, MakeScalingMatrix(this.scale))
    );
  }
}

// The Camera.
class Camera {
  constructor(position, orientation) {
    if (!(this instanceof Camera)) {
      return new Camera(position, orientation);
    }

    this.position = position;
    this.orientation = orientation;
    this.clipping_planes = [];
  }
}

// A Clipping Plane.
class Plane {
  constructor(normal, distance) {
    if (!(this instanceof Plane)) {
      return new Plane(normal, distance);
    }

    this.normal = normal;
    this.distance = distance;
  }
}

// ----- Sphere model generator -----
var GenerateSphere = function (divs, color) {
  var vertices = [];
  var triangles = [];

  var delta_angle = (2.0 * Math.PI) / divs;

  // Generate vertices and normals.
  for (var d = 0; d < divs + 1; d++) {
    var y = (2.0 / divs) * (d - divs / 2);
    var radius = Math.sqrt(1.0 - y * y);
    for (var i = 0; i < divs; i++) {
      var vertex = new Vertex(radius * Math.cos(i * delta_angle), y, radius * Math.sin(i * delta_angle));
      vertices.push(vertex);
    }
  }

  // Generate triangles.
  for (var d = 0; d < divs; d++) {
    for (var i = 0; i < divs; i++) {
      var i0 = d * divs + i;
      var i1 = (d + 1) * divs + ((i + 1) % divs);
      var i2 = divs * d + ((i + 1) % divs);
      var tri0 = [i0, i1, i2];
      var tri1 = [i0, i0 + divs, i1];
      triangles.push(new Triangle(tri0, color, [vertices[tri0[0]], vertices[tri0[1]], vertices[tri0[2]]]));
      triangles.push(new Triangle(tri1, color, [vertices[tri1[0]], vertices[tri1[1]], vertices[tri1[2]]]));
    }
  }

  return new Model(vertices, triangles, new Vertex(0, 0, 0), 1.0);
};
