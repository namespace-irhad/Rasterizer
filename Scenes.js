const sceneTitleElement = document.getElementById('scene-title');

// ----- Cube model -----
const vertices = [
  new Vertex(1, 1, 1),
  new Vertex(-1, 1, 1),
  new Vertex(-1, -1, 1),
  new Vertex(1, -1, 1),
  new Vertex(1, 1, -1),
  new Vertex(-1, 1, -1),
  new Vertex(-1, -1, -1),
  new Vertex(1, -1, -1),
];

const wood_texture = new Texture('./assets/crate-texture.jpg');
const bump_wood_texture = new BumpMap('./assets/bump-map.png');
const triangles = [
  new Triangle(
    [0, 1, 2],
    Color.RED,
    [new Vertex(0, 0, 1), new Vertex(0, 0, 1), new Vertex(0, 0, 1)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [0, 2, 3],
    Color.RED,
    [new Vertex(0, 0, 1), new Vertex(0, 0, 1), new Vertex(0, 0, 1)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [4, 0, 3],
    Color.GREEN,
    [new Vertex(1, 0, 0), new Vertex(1, 0, 0), new Vertex(1, 0, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [4, 3, 7],
    Color.GREEN,
    [new Vertex(1, 0, 0), new Vertex(1, 0, 0), new Vertex(1, 0, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [5, 4, 7],
    Color.BLUE,
    [new Vertex(0, 0, -1), new Vertex(0, 0, -1), new Vertex(0, 0, -1)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [5, 7, 6],
    Color.BLUE,
    [new Vertex(0, 0, -1), new Vertex(0, 0, -1), new Vertex(0, 0, -1)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [1, 5, 6],
    Color.YELLOW,
    [new Vertex(-1, 0, 0), new Vertex(-1, 0, 0), new Vertex(-1, 0, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [1, 6, 2],
    Color.YELLOW,
    [new Vertex(-1, 0, 0), new Vertex(-1, 0, 0), new Vertex(-1, 0, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [1, 0, 5],
    Color.PURPLE,
    [new Vertex(0, 1, 0), new Vertex(0, 1, 0), new Vertex(0, 1, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [5, 0, 4],
    Color.PURPLE,
    [new Vertex(0, 1, 0), new Vertex(0, 1, 0), new Vertex(0, 1, 0)],
    wood_texture,
    [new Pt(0, 1), new Pt(1, 1), new Pt(0, 0)],
    bump_wood_texture
  ),
  new Triangle(
    [2, 6, 7],
    Color.CYAN,
    [new Vertex(0, -1, 0), new Vertex(0, -1, 0), new Vertex(0, -1, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)],
    bump_wood_texture
  ),
  new Triangle(
    [2, 7, 3],
    Color.CYAN,
    [new Vertex(0, -1, 0), new Vertex(0, -1, 0), new Vertex(0, -1, 0)],
    wood_texture,
    [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)],
    bump_wood_texture
  ),
];

const cube = new Model(vertices, triangles, new Vertex(0, 0, 0), Math.sqrt(3));

// ----------

let SetUsePerspectiveCorrectDepth = function (use_perspective_correct_depth) {
  UsePerspectiveCorrectDepth = use_perspective_correct_depth;
};

const Scene1 = () => {
  sceneTitleElement.textContent = 'Environment Map (Front, Right, Behind, Left)';
  let instances = [
    new Instance(cube, new Vertex(-2, 1, 5), MakeOYRotationMatrix(30)),
    new Instance(cube, new Vertex(3, 0, 0), MakeOYRotationMatrix(-30)),
    new Instance(cube, new Vertex(-2, 0, 10), MakeOYRotationMatrix(-30)),
    new Instance(cube, new Vertex(5, 0, 12), MakeOYRotationMatrix(90)),
    new Instance(cube, new Vertex(-2, 1, 5), Identity4x4, 0.75), // BumpMap Showcase
    new Instance(cube, new Vertex(1.25, 2.5, 7.5), MakeOYRotationMatrix(195)),
    // new Instance(GenerateSphere(15, Color.GREEN), new Vertex(10, -5, 20), Identity4x4, 5),
  ];

  // OBJInstance.build('head', 1.0, new Vertex(-2, 1, 5), MakeOYRotationMatrix(110)).then((i) => instances.push(i));
  // OBJInstance.build('mug', 1.0, new Vertex(-2, -1, 8), MakeOYRotationMatrix(140)).then((i) => instances.push(i));
  // OBJInstance.build('car', 1.0, new Vertex(-1, -1, 8), MakeOYRotationMatrix(90)).then((i) => instances.push(i));

  // Show canvas
  document.getElementById('test-canvas').style.display = 'block';

  const camera = new Camera(new Vertex(-4, 1, 2), MakeOYRotationMatrix(-30));

  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];

  const lights = [new Light(LT_AMBIENT, 0.2), new Light(LT_POINT, 0.6, new Vertex(-3, 2, -10))];

  // DrawWireframeTriangle(new Vertex(-100, 200, 100), new Vertex(100, 200, -100), new Vertex(100, -200, -100), Color.RED, canvas_buffer);
  // DrawFilledTriangle(new Vertex(-90, 100, 90), new Vertex(90, 190, -90), new Vertex(90, -190, -90), Color.GREEN);
  // DrawShadedTriangle(new Vertex(5, -200, 10), new Vertex(-100, 70, -5), new Vertex(150, -70, 10), Color.BLUE, canvas_buffer);

  SetUsePerspectiveCorrectDepth = function (use_perspective_correct_depth) {
    UsePerspectiveCorrectDepth = use_perspective_correct_depth;
    Render();
  };

  function Render() {
    // This lets the browser clear the canvas before blocking to render the scene.
    setTimeout(function () {
      RenderScene(camera, instances, lights, canvas, canvas_buffer);
      Rasterizer.ClearAll();
      Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      const envTextures = EnvironmentMap(instances[0], instances, lights, camera);
      Rasterizer.ClearAll();

      const environmentTexture = new Texture(envTextures[2]);
      setTimeout(() => {
        environmentTexture.drawOnTop(wood_texture);
        // document.getElementById('camera-view').src = environmentTexture.image.src;
        const triangles2 = [
          new Triangle(
            [0, 1, 2],
            Color.RED,
            [new Vertex(0, 0, 1), new Vertex(0, 0, 1), new Vertex(0, 0, 1)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [0, 2, 3],
            Color.RED,
            [new Vertex(0, 0, 1), new Vertex(0, 0, 1), new Vertex(0, 0, 1)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)]
          ),
          new Triangle(
            [4, 0, 3],
            Color.GREEN,
            [new Vertex(1, 0, 0), new Vertex(1, 0, 0), new Vertex(1, 0, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [4, 3, 7],
            Color.GREEN,
            [new Vertex(1, 0, 0), new Vertex(1, 0, 0), new Vertex(1, 0, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)]
          ),
          new Triangle(
            [5, 4, 7],
            Color.BLUE,
            [new Vertex(0, 0, -1), new Vertex(0, 0, -1), new Vertex(0, 0, -1)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [5, 7, 6],
            Color.BLUE,
            [new Vertex(0, 0, -1), new Vertex(0, 0, -1), new Vertex(0, 0, -1)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)]
          ),
          new Triangle(
            [1, 5, 6],
            Color.YELLOW,
            [new Vertex(-1, 0, 0), new Vertex(-1, 0, 0), new Vertex(-1, 0, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [1, 6, 2],
            Color.YELLOW,
            [new Vertex(-1, 0, 0), new Vertex(-1, 0, 0), new Vertex(-1, 0, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)]
          ),
          new Triangle(
            [1, 0, 5],
            Color.PURPLE,
            [new Vertex(0, 1, 0), new Vertex(0, 1, 0), new Vertex(0, 1, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [5, 0, 4],
            Color.PURPLE,
            [new Vertex(0, 1, 0), new Vertex(0, 1, 0), new Vertex(0, 1, 0)],
            environmentTexture,
            [new Pt(0, 1), new Pt(1, 1), new Pt(0, 0)]
          ),
          new Triangle(
            [2, 6, 7],
            Color.CYAN,
            [new Vertex(0, -1, 0), new Vertex(0, -1, 0), new Vertex(0, -1, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 0), new Pt(1, 1)]
          ),
          new Triangle(
            [2, 7, 3],
            Color.CYAN,
            [new Vertex(0, -1, 0), new Vertex(0, -1, 0), new Vertex(0, -1, 0)],
            environmentTexture,
            [new Pt(0, 0), new Pt(1, 1), new Pt(0, 1)]
          ),
        ];
        const cube2 = new Model(vertices, triangles2, new Vertex(0, 0, 0), Math.sqrt(3));
        const textureInstance = new Instance(cube2, new Vertex(-2, 1, 5), MakeOYRotationMatrix(30));
        instances.shift();
        instances = [textureInstance, ...instances];
        RenderScene(camera, instances, lights, canvas, canvas_buffer);
        Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      }, 10);
    }, 0);
  }

  if (wood_texture.image.complete) {
    Render();
  } else {
    wood_texture.image.addEventListener('load', Render);
  }
};

const Scene2 = () => {
  sceneTitleElement.textContent = 'Wood Bump Map';
  let instances = [
    new Instance(cube, new Vertex(-2, 1, 5), MakeOYRotationMatrix(30)),
    new Instance(cube, new Vertex(3, 0, 0), MakeOYRotationMatrix(-30)),
    new Instance(cube, new Vertex(-2, 0, 10), MakeOYRotationMatrix(-30)),
    new Instance(cube, new Vertex(5, 0, 12), MakeOYRotationMatrix(90)),
    new Instance(cube, new Vertex(-2, 1, 5), Identity4x4, 0.75), // BumpMap Showcase
    new Instance(cube, new Vertex(1.25, 2.5, 7.5), MakeOYRotationMatrix(195)),
    // new Instance(GenerateSphere(15, Color.GREEN), new Vertex(10, -5, 20), Identity4x4, 5),
  ];

  // Show canvas
  document.getElementById('test-canvas').style.display = 'block';

  // OBJInstance.build('head', 1.0, new Vertex(-2, 1, 5), MakeOYRotationMatrix(110)).then((i) => instances.push(i));
  // OBJInstance.build('mug', 1.0, new Vertex(-2, -1, 8), MakeOYRotationMatrix(140)).then((i) => instances.push(i));
  // OBJInstance.build('car', 1.0, new Vertex(-1, -1, 8), MakeOYRotationMatrix(90)).then((i) => instances.push(i));

  const camera = new Camera(new Vertex(-4, 1, 2), MakeOYRotationMatrix(-30));

  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];

  const lights = [new Light(LT_AMBIENT, 0.2), new Light(LT_POINT, 0.6, new Vertex(-3, 2, -10))];

  // DrawWireframeTriangle(new Vertex(-100, 200, 100), new Vertex(100, 200, -100), new Vertex(100, -200, -100), Color.RED, canvas_buffer);
  // DrawFilledTriangle(new Vertex(-90, 100, 90), new Vertex(90, 190, -90), new Vertex(90, -190, -90), Color.GREEN);
  // DrawShadedTriangle(new Vertex(5, -200, 10), new Vertex(-100, 70, -5), new Vertex(150, -70, 10), Color.BLUE, canvas_buffer);

  SetUsePerspectiveCorrectDepth = function (use_perspective_correct_depth) {
    UsePerspectiveCorrectDepth = use_perspective_correct_depth;
    Render();
  };

  function Render() {
    // This lets the browser clear the canvas before blocking to render the scene.
    setTimeout(function () {
      RenderScene(camera, instances, lights, canvas, canvas_buffer);
      Rasterizer.ClearAll();
      Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      // Add Bump Map image to the canvas.
      document.getElementById('test-canvas').getContext('2d').drawImage(bump_wood_texture.image, 0, 0);
      Rasterizer.ClearAll();

      setTimeout(() => {
        RenderScene(camera, instances, lights, canvas, canvas_buffer);
        Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      }, 10);
    }, 0);
  }

  if (wood_texture.image.complete) {
    Render();
  } else {
    wood_texture.image.addEventListener('load', Render);
  }
};

const Scene3 = () => {
  sceneTitleElement.textContent = 'OBJ Instanciranje (Glava)';
  let instances = [];

  OBJInstance.build('head', 1.0, new Vertex(-2, 1, 5), MakeOYRotationMatrix(110)).then((i) => instances.push(i));
  // OBJInstance.build('mug', 1.0, new Vertex(-2, -1, 8), MakeOYRotationMatrix(140)).then((i) => instances.push(i));
  // OBJInstance.build('car', 1.0, new Vertex(-1, -1, 8), MakeOYRotationMatrix(90)).then((i) => instances.push(i));

  // Hide canvas
  document.getElementById('test-canvas').style.display = 'none';

  const camera = new Camera(new Vertex(-4, 1, 2), MakeOYRotationMatrix(-30));

  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];

  const lights = [new Light(LT_AMBIENT, 0.2), new Light(LT_POINT, 0.6, new Vertex(-3, 2, -10))];

  function Render() {
    // This lets the browser clear the canvas before blocking to render the scene.
    setTimeout(function () {
      RenderScene(camera, instances, lights, canvas, canvas_buffer);
      Rasterizer.ClearAll();
      Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      // Hide canvas
      document.getElementById('test-canvas').style.display = 'none';
      Rasterizer.ClearAll();

      setTimeout(() => {
        RenderScene(camera, instances, lights, canvas, canvas_buffer);
        Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      }, 10);
    }, 0);
  }

  if (wood_texture.image.complete) {
    Render();
  } else {
    wood_texture.image.addEventListener('load', Render);
  }
};

const Scene4 = () => {
  sceneTitleElement.textContent = 'OBJ Instanciranje (Solja)';
  let instances = [];

  // OBJInstance.build('head', 1.0, new Vertex(-2, 1, 5), MakeOYRotationMatrix(110)).then((i) => instances.push(i));
  OBJInstance.build('mug', 1.0, new Vertex(-2, 0, 6), MakeOYRotationMatrix(200)).then((i) => instances.push(i));
  // OBJInstance.build('car', 1.0, new Vertex(-1, -1, 8), MakeOYRotationMatrix(90)).then((i) => instances.push(i));

  const camera = new Camera(new Vertex(-4, 1, 2), MakeOYRotationMatrix(-30));

  // Hide canvas
  document.getElementById('test-canvas').style.display = 'none';

  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];

  const lights = [new Light(LT_AMBIENT, 0.2), new Light(LT_POINT, 0.6, new Vertex(-3, 2, -10))];

  function Render() {
    // This lets the browser clear the canvas before blocking to render the scene.
    setTimeout(function () {
      RenderScene(camera, instances, lights, canvas, canvas_buffer);
      Rasterizer.ClearAll();
      Rasterizer.updateCanvas(canvas_context, canvas_buffer);

      Rasterizer.ClearAll();

      setTimeout(() => {
        RenderScene(camera, instances, lights, canvas, canvas_buffer);
        Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      }, 10);
    }, 0);
  }

  if (wood_texture.image.complete) {
    Render();
  } else {
    wood_texture.image.addEventListener('load', Render);
  }
};

const Scene5 = () => {
  sceneTitleElement.textContent = 'OBJ Instanciranje (Automobil)';
  let instances = [];

  // Hide canvas
  document.getElementById('test-canvas').style.display = 'none';

  // OBJInstance.build('head', 1.0, new Vertex(-2, 1, 5), MakeOYRotationMatrix(110)).then((i) => instances.push(i));
  // OBJInstance.build('mug', 1.0, new Vertex(-2, 0, 6), MakeOYRotationMatrix(200)).then((i) => instances.push(i));
  OBJInstance.build('car', 1.0, new Vertex(-1, -1, 8), MakeOYRotationMatrix(90)).then((i) => instances.push(i));

  const camera = new Camera(new Vertex(-4, 1, 2), MakeOYRotationMatrix(-30));

  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];

  const lights = [new Light(LT_AMBIENT, 0.2), new Light(LT_POINT, 0.6, new Vertex(-3, 2, -10))];

  function Render() {
    // This lets the browser clear the canvas before blocking to render the scene.
    setTimeout(function () {
      RenderScene(camera, instances, lights, canvas, canvas_buffer);
      Rasterizer.ClearAll();
      Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      Rasterizer.ClearAll();

      setTimeout(() => {
        RenderScene(camera, instances, lights, canvas, canvas_buffer);
        Rasterizer.updateCanvas(canvas_context, canvas_buffer);
      }, 10);
    }, 0);
  }

  if (wood_texture.image.complete) {
    Render();
  } else {
    wood_texture.image.addEventListener('load', Render);
  }
};
