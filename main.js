// A Light.
const LT_AMBIENT = 0;
const LT_POINT = 1;
const LT_DIRECTIONAL = 2;

class Light {
  constructor(type, intensity, vector) {
    if (!(this instanceof Light)) {
      return new Light(type, intensity, vector);
    }

    this.type = type;
    this.intensity = intensity;
    this.vector = vector;
  }
}

// ======================================================================
//  Rasterization code.
// ======================================================================

// Scene setup.
var viewport_size = 1;
var projection_plane_z = 1;

var Interpolate = function (i0, d0, i1, d1) {
  if (i0 == i1) {
    return [d0];
  }

  var values = [];
  var a = (d1 - d0) / (i1 - i0);
  var d = d0;
  for (var i = i0; i <= i1; i++) {
    values.push(d);
    d += a;
  }

  return values;
};

var DrawLine = function (p0, p1, color) {
  var dx = p1.x - p0.x,
    dy = p1.y - p0.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // The line is horizontal-ish. Make sure it's left to right.
    if (dx < 0) {
      var swap = p0;
      p0 = p1;
      p1 = swap;
    }

    // Compute the Y values and draw.
    var ys = Interpolate(p0.x, p0.y, p1.x, p1.y);
    for (var x = p0.x; x <= p1.x; x++) {
      Rasterizer.putPixel(x, ys[(x - p0.x) | 0], color, canvas, canvas_buffer);
    }
  } else {
    // The line is verical-ish. Make sure it's bottom to top.
    if (dy < 0) {
      var swap = p0;
      p0 = p1;
      p1 = swap;
    }

    // Compute the X values and draw.
    var xs = Interpolate(p0.y, p0.x, p1.y, p1.x);
    for (var y = p0.y; y <= p1.y; y++) {
      Rasterizer.putPixel(xs[(y - p0.y) | 0], y, color, canvas, canvas_buffer);
    }
  }
};

// Converts 2D viewport coordinates to 2D canvas coordinates.
var ViewportToCanvas = function (p2d) {
  return new Pt(((p2d.x * canvas.width) / viewport_size) | 0, ((p2d.y * canvas.height) / viewport_size) | 0);
};

// Converts 2D canvas coordinates to 2D viewport coordinates.
var CanvasToViewport = function (p2d) {
  return new Pt((p2d.x * viewport_size) / canvas.width, (p2d.y * viewport_size) / canvas.height);
};

var ProjectVertex = function (v) {
  return ViewportToCanvas(new Pt((v.x * projection_plane_z) / v.z, (v.y * projection_plane_z) / v.z));
};

var UnProjectVertex = function (x, y, inv_z) {
  var oz = 1.0 / inv_z;
  var ux = (x * oz) / projection_plane_z;
  var uy = (y * oz) / projection_plane_z;
  var p2d = CanvasToViewport(new Pt(ux, uy));
  return new Vertex(p2d.x, p2d.y, oz);
};

// Sort the points from bottom to top.
// Technically, sort the indexes to the vertex indexes in the triangle from bottom to top.
var SortedVertexIndexes = function (vertex_indexes, projected) {
  indexes = [0, 1, 2];

  if (projected[vertex_indexes[indexes[1]]].y < projected[vertex_indexes[indexes[0]]].y) {
    var swap = indexes[0];
    indexes[0] = indexes[1];
    indexes[1] = swap;
  }
  if (projected[vertex_indexes[indexes[2]]].y < projected[vertex_indexes[indexes[0]]].y) {
    var swap = indexes[0];
    indexes[0] = indexes[2];
    indexes[2] = swap;
  }
  if (projected[vertex_indexes[indexes[2]]].y < projected[vertex_indexes[indexes[1]]].y) {
    var swap = indexes[1];
    indexes[1] = indexes[2];
    indexes[2] = swap;
  }

  return indexes;
};

var ComputeTriangleNormal = function (v0, v1, v2) {
  var v0v1 = Add(v1, Multiply(-1, v0));
  var v0v2 = Add(v2, Multiply(-1, v0));
  return Cross(v0v1, v0v2);
};

var ComputeIllumination = function (vertex, normal, camera, lights) {
  var illumination = 0;
  for (var l = 0; l < lights.length; l++) {
    var light = lights[l];
    if (light.type == LT_AMBIENT) {
      illumination += light.intensity;
      continue;
    }

    var vl;
    if (light.type == LT_DIRECTIONAL) {
      var cameraMatrix = Transposed(camera.orientation);
      var rotated_light = MultiplyMV(cameraMatrix, new Vertex4(light.vector));
      vl = rotated_light;
    } else if (light.type == LT_POINT) {
      var cameraMatrix = MultiplyMM4(
        Transposed(camera.orientation),
        MakeTranslationMatrix(Multiply(-1, camera.position))
      );
      var transformed_light = MultiplyMV(cameraMatrix, new Vertex4(light.vector));
      vl = Add(transformed_light, Multiply(-1, vertex)); // light.vector - vertex
    }

    // Diffuse component.
    var cos_alpha = Dot(vl, normal) / (Magnitude(vl) * Magnitude(normal));
    if (cos_alpha > 0) {
      illumination += cos_alpha * light.intensity;
    }

    // Specular component.
    var reflected = Add(Multiply(2 * Dot(normal, vl), normal), Multiply(-1, vl));
    var view = Add(camera.position, Multiply(-1, vertex));

    var cos_beta = Dot(reflected, view) / (Magnitude(reflected) * Magnitude(view));
    if (cos_beta > 0) {
      var specular = 50;
      illumination += Math.pow(cos_beta, specular) * light.intensity;
    }
  }
  return illumination;
};

var SM_FLAT = 0;
var SM_GOURAUD = 1;
var SM_PHONG = 2;

var ShadingModel = SM_PHONG;
var UseVertexNormals = true;
var UsePerspectiveCorrectDepth = true;

var EdgeInterpolate = function (y0, v0, y1, v1, y2, v2) {
  var v01 = Interpolate(y0, v0, y1, v1);
  var v12 = Interpolate(y1, v1, y2, v2);
  var v02 = Interpolate(y0, v0, y2, v2);
  v01.pop();
  var v012 = v01.concat(v12);
  return [v02, v012];
};

var RenderTriangle = function (triangle, vertices, projected, camera, lights, orientation, canvas, canvas_buffer) {
  // Compute triangle normal. Use the unsorted vertices, otherwise the winding of the points may change.
  var normal = ComputeTriangleNormal(
    vertices[triangle.indexes[0]],
    vertices[triangle.indexes[1]],
    vertices[triangle.indexes[2]]
  );

  // Backface culling.
  var centre = Multiply(
    -1.0 / 3.0,
    Add(Add(vertices[triangle.indexes[0]], vertices[triangle.indexes[1]]), vertices[triangle.indexes[2]])
  );
  if (Dot(centre, normal) < 0) {
    return;
  }

  // Sort by projected point Y.
  var indexes = SortedVertexIndexes(triangle.indexes, projected);
  var [i0, i1, i2] = indexes;
  var [v0, v1, v2] = [vertices[triangle.indexes[i0]], vertices[triangle.indexes[i1]], vertices[triangle.indexes[i2]]];

  // Get attribute values (X, 1/Z, U/Z, U/Z) at the vertices.
  var [p0, p1, p2] = [
    projected[triangle.indexes[i0]],
    projected[triangle.indexes[i1]],
    projected[triangle.indexes[i2]],
  ];

  // Compute attribute values at the edges.
  var [x02, x012] = EdgeInterpolate(p0.y, p0.x, p1.y, p1.x, p2.y, p2.x);
  var [iz02, iz012] = EdgeInterpolate(p0.y, 1.0 / v0.z, p1.y, 1.0 / v1.z, p2.y, 1.0 / v2.z);
  if (triangle.texture) {
    if (UsePerspectiveCorrectDepth) {
      var [uz02, uz012] = EdgeInterpolate(
        p0.y,
        triangle.uvs[i0].x / v0.z,
        p1.y,
        triangle.uvs[i1].x / v1.z,
        p2.y,
        triangle.uvs[i2].x / v2.z
      );
      var [vz02, vz012] = EdgeInterpolate(
        p0.y,
        triangle.uvs[i0].y / v0.z,
        p1.y,
        triangle.uvs[i1].y / v1.z,
        p2.y,
        triangle.uvs[i2].y / v2.z
      );
    } else {
      var [uz02, uz012] = EdgeInterpolate(p0.y, triangle.uvs[i0].x, p1.y, triangle.uvs[i1].x, p2.y, triangle.uvs[i2].x);
      var [vz02, vz012] = EdgeInterpolate(p0.y, triangle.uvs[i0].y, p1.y, triangle.uvs[i1].y, p2.y, triangle.uvs[i2].y);
    }
  }

  if (UseVertexNormals) {
    var transform = MultiplyMM4(Transposed(camera.orientation), orientation);
    var normal0 = MultiplyMV(transform, new Vertex4(triangle.normals[i0]));
    var normal1 = MultiplyMV(transform, new Vertex4(triangle.normals[i1]));
    var normal2 = MultiplyMV(transform, new Vertex4(triangle.normals[i2]));
  } else {
    var normal0 = normal;
    var normal1 = normal;
    var normal2 = normal;
  }

  if (ShadingModel == SM_FLAT) {
    // Flat shading: compute lighting for the entire triangle.
    var center = new Vertex((v0.x + v1.x + v2.x) / 3.0, (v0.y + v1.y + v2.y) / 3.0, (v0.z + v1.z + v2.z) / 3.0);
    var intensity = ComputeIllumination(center, normal0, camera, lights);
  } else if (ShadingModel == SM_GOURAUD) {
    // Gouraud shading: compute lighting at the vertices, and interpolate.
    var i0 = ComputeIllumination(v0, normal0, camera, lights);
    var i1 = ComputeIllumination(v1, normal1, camera, lights);
    var i2 = ComputeIllumination(v2, normal2, camera, lights);
    var [i02, i012] = EdgeInterpolate(p0.y, i0, p1.y, i1, p2.y, i2);
  } else if (ShadingModel == SM_PHONG) {
    // Phong shading: interpolate normal vectors.
    var [nx02, nx012] = EdgeInterpolate(p0.y, normal0.x, p1.y, normal1.x, p2.y, normal2.x);
    var [ny02, ny012] = EdgeInterpolate(p0.y, normal0.y, p1.y, normal1.y, p2.y, normal2.y);
    var [nz02, nz012] = EdgeInterpolate(p0.y, normal0.z, p1.y, normal1.z, p2.y, normal2.z);
  }

  // Determine which is left and which is right.
  var m = (x02.length / 2) | 0;
  if (x02[m] < x012[m]) {
    var [x_left, x_right] = [x02, x012];
    var [iz_left, iz_right] = [iz02, iz012];
    var [i_left, i_right] = [i02, i012];

    var [nx_left, nx_right] = [nx02, nx012];
    var [ny_left, ny_right] = [ny02, ny012];
    var [nz_left, nz_right] = [nz02, nz012];

    var [uz_left, uz_right] = [uz02, uz012];
    var [vz_left, vz_right] = [vz02, vz012];
  } else {
    var [x_left, x_right] = [x012, x02];
    var [iz_left, iz_right] = [iz012, iz02];
    var [i_left, i_right] = [i012, i02];

    var [nx_left, nx_right] = [nx012, nx02];
    var [ny_left, ny_right] = [ny012, ny02];
    var [nz_left, nz_right] = [nz012, nz02];

    var [uz_left, uz_right] = [uz012, uz02];
    var [vz_left, vz_right] = [vz012, vz02];
  }

  // Draw horizontal segments.
  for (var y = p0.y; y <= p2.y; y++) {
    var [xl, xr] = [x_left[y - p0.y] | 0, x_right[y - p0.y] | 0];

    // Interpolate attributes for this scanline.
    var [zl, zr] = [iz_left[y - p0.y], iz_right[y - p0.y]];
    var zscan = Interpolate(xl, zl, xr, zr);

    if (ShadingModel == SM_GOURAUD) {
      var [il, ir] = [i_left[y - p0.y], i_right[y - p0.y]];
      var iscan = Interpolate(xl, il, xr, ir);
    } else if (ShadingModel == SM_PHONG) {
      var [nxl, nxr] = [nx_left[y - p0.y], nx_right[y - p0.y]];
      var [nyl, nyr] = [ny_left[y - p0.y], ny_right[y - p0.y]];
      var [nzl, nzr] = [nz_left[y - p0.y], nz_right[y - p0.y]];

      var nxscan = Interpolate(xl, nxl, xr, nxr);
      var nyscan = Interpolate(xl, nyl, xr, nyr);
      var nzscan = Interpolate(xl, nzl, xr, nzr);
    }

    if (triangle.texture) {
      var uzscan = Interpolate(xl, uz_left[y - p0.y], xr, uz_right[y - p0.y]);
      var vzscan = Interpolate(xl, vz_left[y - p0.y], xr, vz_right[y - p0.y]);
    }

    for (var x = xl; x <= xr; x++) {
      var inv_z = zscan[x - xl];
      if (Rasterizer.UpdateDepthBufferIfCloser(x, y, inv_z)) {
        if (triangle.texture) {
          if (UsePerspectiveCorrectDepth) {
            var u = uzscan[x - xl] / zscan[x - xl];
            var v = vzscan[x - xl] / zscan[x - xl];
          } else {
            var u = uzscan[x - xl];
            var v = vzscan[x - xl];
          }
          color = triangle.texture.getTexel(u, v);
        } else {
          color = triangle.color;
        }

        if (ShadingModel == SM_FLAT) {
          // Just use the per-triangle intensity.
        } else if (ShadingModel == SM_GOURAUD) {
          intensity = iscan[x - xl];
        } else if (ShadingModel == SM_PHONG) {
          var vertex = UnProjectVertex(x, y, inv_z);
          var normal = new Vertex(nxscan[x - xl], nyscan[x - xl], nzscan[x - xl]);
          // Normal map to get a normal vector for the specified pixel

          if (triangle.bump_map) {
            // Get tangent vector for the specified pixel

            // Triangle vertices in world space.
            const v1 = vertices[triangle.indexes[0]];
            const v2 = vertices[triangle.indexes[1]];
            const v3 = vertices[triangle.indexes[2]];

            // Get triangle edges
            var e1 = new Vertex(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
            var e2 = new Vertex(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);

            // https://learnopengl.com/Advanced-Lighting/Normal-Mapping
            // Get delta UV coordinates
            var duv1 = new Vertex(triangle.uvs[0].x - triangle.uvs[1].x, triangle.uvs[0].y - triangle.uvs[1].y, 0);
            var duv2 = new Vertex(triangle.uvs[0].x - triangle.uvs[2].x, triangle.uvs[0].y - triangle.uvs[2].y, 0);
            // Calculate tangent and bitangent
            const f = 1.0 / (duv1.x * duv2.y - duv2.x * duv1.y);
            const tangent = new Vertex(
              f * (duv2.y * e1.x - duv1.y * e2.x),
              f * (duv2.y * e1.y - duv1.y * e2.y),
              f * (duv2.y * e1.z - duv1.y * e2.z)
            );
            const bitangent = new Vertex(
              f * (-duv2.x * e1.x + duv1.x * e2.x),
              f * (-duv2.x * e1.y + duv1.x * e2.y),
              f * (-duv2.x * e1.z + duv1.x * e2.z)
            );
            // Calculate the normal for the specified pixel
            normal = new Vertex(
              normal.x +
                triangle.bump_map.getNormal(u, v).x * tangent.x +
                triangle.bump_map.getNormal(u, v).y * bitangent.x,
              normal.y +
                triangle.bump_map.getNormal(u, v).x * tangent.y +
                triangle.bump_map.getNormal(u, v).y * bitangent.y,
              normal.z +
                triangle.bump_map.getNormal(u, v).x * tangent.z +
                triangle.bump_map.getNormal(u, v).y * bitangent.z
            );
          }

          var intensity = ComputeIllumination(vertex, normal, camera, lights);
        }
        Rasterizer.putPixel(x, y, Color.multiply(color, intensity), canvas, canvas_buffer);
      }
    }
  }
};

// Clips a triangle against a plane. Adds output to triangles and vertices.
var ClipTriangle = function (triangle, plane, triangles, vertices) {
  var v0 = vertices[triangle.indexes[0]];
  var v1 = vertices[triangle.indexes[1]];
  var v2 = vertices[triangle.indexes[2]];

  var in0 = Dot(plane.normal, v0) + plane.distance > 0;
  var in1 = Dot(plane.normal, v1) + plane.distance > 0;
  var in2 = Dot(plane.normal, v2) + plane.distance > 0;

  var in_count = in0 + in1 + in2;
  if (in_count == 0) {
    // Nothing to do - the triangle is fully clipped out.
  } else if (in_count == 3) {
    // The triangle is fully in front of the plane.
    triangles.push(triangle);
  } else if (in_count == 1) {
    // The triangle has one vertex in. Output is one clipped triangle.
  } else if (in_count == 2) {
    // The triangle has two vertices in. Output is two clipped triangles.
  }
};

var TransformAndClip = function (clipping_planes, model, transform) {
  // Transform the bounding sphere, and attempt early discard.
  center = MultiplyMV(transform, new Vertex4(model.bounds_center));
  var radius2 = model.bounds_radius * model.bounds_radius;
  for (var p = 0; p < clipping_planes.length; p++) {
    var distance2 = Dot(clipping_planes[p].normal, center) + clipping_planes[p].distance;
    if (distance2 < -radius2) {
      return null;
    }
  }

  // Apply modelview transform.
  var vertices = [];
  for (var i = 0; i < model.vertices.length; i++) {
    vertices.push(MultiplyMV(transform, new Vertex4(model.vertices[i])));
  }

  // Clip the entire model against each successive plane.
  var triangles = model.triangles.slice();
  for (var p = 0; p < clipping_planes.length; p++) {
    new_triangles = [];
    for (var i = 0; i < triangles.length; i++) {
      ClipTriangle(triangles[i], clipping_planes[p], new_triangles, vertices);
    }
    triangles = new_triangles;
  }

  return new Model(vertices, triangles, center, model.bounds_radius);
};

var RenderModel = function (model, camera, lights, orientation, canvasElement, canvasBuffer) {
  var projected = [];
  for (var i = 0; i < model.vertices.length; i++) {
    projected.push(ProjectVertex(new Vertex4(model.vertices[i])));
  }
  for (var i = 0; i < model.triangles.length; i++) {
    RenderTriangle(
      model.triangles[i],
      model.vertices,
      projected,
      camera,
      lights,
      orientation,
      canvasElement,
      canvasBuffer
    );
  }
};

var RenderScene = function (camera, instances, lights, canvas, canvasBuffer) {
  var cameraMatrix = MultiplyMM4(Transposed(camera.orientation), MakeTranslationMatrix(Multiply(-1, camera.position)));

  for (var i = 0; i < instances.length; i++) {
    var transform = MultiplyMM4(cameraMatrix, instances[i].transform);
    var clipped = TransformAndClip(camera.clipping_planes, instances[i].model, transform);

    if (clipped != null) {
      RenderModel(clipped, camera, lights, instances[i].orientation, canvas, canvasBuffer);
    }
  }
};
