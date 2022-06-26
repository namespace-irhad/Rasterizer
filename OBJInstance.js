const parseObj = (text) => {
  const mesh = {
    vertices: [],
    faces: [],
  };
  const lines = text.replace('\r', '').split('\n');

  for (let n = 0; n < lines.length; n++) {
    const line = lines[n].split(' ');
    switch (line[0]) {
      case 'v':
        {
          mesh.vertices.push(new Vertex(parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3])));
        }
        break;

      case 'f':
        {
          const f1 = line[1].split('/');
          const f2 = line[2].split('/');
          const f3 = line[3].split('/');
          mesh.faces.push([parseInt(f1[0] - 1, 10), parseInt(f2[0] - 1, 10), parseInt(f3[0] - 1, 10)]);
        }
        break;
    }
  }

  return mesh;
};

const isCounterClockwise = (a, b, c) => {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
};

class OBJInstance {
  static loadModel = (scale = 1.0, position, rotation) => {
    const faces = this.object.faces;
    const vertices = this.object.vertices;
    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      const v0 = vertices[face[0]];
      const v1 = vertices[face[1]];
      const v2 = vertices[face[2]];
      const v0_ = new Vertex(v0.x * scale, v0.y * scale, v0.z * scale);
      const v1_ = new Vertex(v1.x * scale, v1.y * scale, v1.z * scale);
      const v2_ = new Vertex(v2.x * scale, v2.y * scale, v2.z * scale);
      if (isCounterClockwise(v0_, v1_, v2_)) {
        triangles.push(new Triangle(face, Color.RED, [v0_, v1_, v2_]));
      }
    }
    const objectModel = new Model(vertices, triangles, new Vertex(0, 0, 0), Math.sqrt(3));
    return new Instance(objectModel, position || new Vertex(0, 0, 0), rotation || MakeOYRotationMatrix(130));
  };

  static build = (model, scale, position, rotation) => {
    return (async () => {
      await fetch(`assets/${model}.obj`)
        .then((response) => response.text())
        .then((text) => {
          this.object = parseObj(text);
        });
      this.instance = OBJInstance.loadModel(scale, position, rotation);
      return this.instance;
    })();
  };
}
