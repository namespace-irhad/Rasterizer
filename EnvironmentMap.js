// Makes a transform matrix for a rotation around the OX axis.
const MakeOXRotationMatrix = function (degrees) {
  var cos = Math.cos((degrees * Math.PI) / 180.0);
  var sin = Math.sin((degrees * Math.PI) / 180.0);

  return new Mat4x4([
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ]);
};

// Makes a transform matrix for a rotation around the OZ axis.
const MakeOZRotationMatrix = function (degrees) {
  var cos = Math.cos((degrees * Math.PI) / 180.0);
  var sin = Math.sin((degrees * Math.PI) / 180.0);

  return new Mat4x4([
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
};

// Environment map for instances
const EnvironmentMap = function (object, instances, lights, camera) {
  // Place a camera in the middle of the object and render the scene 4 times (each perpendicular direction excluding the top and bottom)

  camera = new Camera(object.position, object.orientation);
  const s2 = Math.sqrt(2);
  camera.clipping_planes = [
    new Plane(new Vertex(0, 0, 1), -1), // Near
    new Plane(new Vertex(s2, 0, s2), 0), // Left
    new Plane(new Vertex(-s2, 0, s2), 0), // Right
    new Plane(new Vertex(0, -s2, s2), 0), // Top
    new Plane(new Vertex(0, s2, s2), 0), // Bottom
  ];
  // Create a canvas for each of the six faces
  const canvases = [
    document.createElement('canvas'),
    document.createElement('canvas'),
    document.createElement('canvas'),
    document.createElement('canvas'),
    document.createElement('canvas'),
    document.createElement('canvas'),
  ];
  canvases.forEach((canvas) => {
    canvas.width = 600;
    canvas.height = 600;
    // Fill canvas with white
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
  // Render the scene for each of the 4 faces (excluding the top and bottom)
  for (let i = 0; i < 4; i++) {
    // Set Canvas to render to the correct face
    const canvas = canvases[i];
    const ctx = canvas.getContext('2d');
    const canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Set the camera orientation to the new orientation all 4 sides of the cube
    const orientation = MakeOYRotationMatrix((i + 1) * 90);
    const newInstances = instances.filter((instance) => instance.id !== object.id);

    RenderScene(camera, newInstances, lights, canvas, canvasBuffer);
    Rasterizer.updateCanvas(ctx, canvasBuffer);

    // Change the orientation of the camera for the next face
    camera.orientation = MultiplyMM4(camera.orientation, orientation);
  }

  // Za gornju i donju stranu

  // Get top face using MakeOXRotationMatrix(90)
  const canvas = canvases[4];
  const ctx = canvas.getContext('2d');
  const canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const orientation = MakeOXRotationMatrix(90);
  const newInstances = instances.filter((instance) => instance.id !== object.id);
  camera.orientation = MultiplyMM4(camera.orientation, orientation);
  RenderScene(camera, newInstances, lights, canvas, canvasBuffer);
  Rasterizer.updateCanvas(ctx, canvasBuffer);
  // Get bottom face using MakeOXRotationMatrix(-90)
  const canvas2 = canvases[5];
  const ctx2 = canvas2.getContext('2d');
  const canvasBuffer2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
  const orientation2 = MakeOXRotationMatrix(-90);
  const newInstances2 = instances.filter((instance) => instance.id !== object.id);
  camera.orientation = MultiplyMM4(camera.orientation, orientation2);
  RenderScene(camera, newInstances2, lights, canvas2, canvasBuffer2);
  Rasterizer.updateCanvas(ctx2, canvasBuffer2);

  // Preview the environment map
  const previewCanvas = document.getElementById('test-canvas');
  previewCanvas.width = 600;
  previewCanvas.height = 600;
  const previewCtx = previewCanvas.getContext('2d');
  // Split preview canvas into 4 faces and draw each face
  for (let i = 0; i < 4; i++) {
    const canvas = canvases[i];
    const ctx = previewCtx;
    const x = i % 2;
    const y = Math.floor(i / 2);
    ctx.drawImage(canvas, x * 256, y * 256, 256, 256);
    // Top left corner write direction
    ctx.font = '16px Arial';
    ctx.fillStyle = 'darksalmon';
    ctx.fillText(`Direkcija ${i}`, x * 256, (y + 0.1) * 256);
  }
  return canvases.map((canvas) => {
    return canvas.toDataURL();
  });
  // Convert canvas to image
};
