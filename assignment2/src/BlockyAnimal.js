var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

//Global Variables
let canvas;
let gl;
let u_Size;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let g_CamX = 0;
let g_CamY = 0;
let g_CamZ = 0;
let g_Ani = false; // animation

var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
var g_jointy1 = 0;
var g_jointy2 = 0;
var g_jointy3 = 0;

var shift_click = false;
let g_headOffsetX = 0;
let g_headOffsetZ = 0;

function addActionForHtmlUI() {
  document
    .getElementById("CameraSlideX")
    .addEventListener("mousemove", function () {
      g_CamX = this.value;
      renderScene();
    });
  document
    .getElementById("CameraSlideY")
    .addEventListener("mousemove", function () {
      g_CamY = this.value;
      renderScene();
    });
  document
    .getElementById("CameraSlideZ")
    .addEventListener("mousemove", function () {
      g_CamZ = this.value;
      renderScene();
    });

  document.getElementById("Animation_On").onclick = function () {
    g_Ani = true;
  };
  document.getElementById("Animation_Off").onclick = function () {
    g_Ani = false;
  };

  document.getElementById("PokeMode_On").onclick = () => {
    shift_click = true;

    g_Ani = false;
    renderScene();
  };
  document.getElementById("PokeMode_Off").onclick = () => {
    shift_click = false;
    renderScene();
  };

  //3. render all the shapes
  document.getElementById("joint1").addEventListener("mousemove", function () {
    g_jointy1 = this.value;
    renderScene();
  });

  document.getElementById("joint2").addEventListener("mousemove", function () {
    g_jointy2 = this.value;
    renderScene();
  });

  document.getElementById("joint3").addEventListener("mousemove", function () {
    g_jointy3 = this.value;
    renderScene();
  });

  canvas.addEventListener("click", function (ev) {
    if (ev.shiftKey) {
      shift_click = !shift_click;
      if (shift_click) g_Ani = false;
      renderScene();
    }
  });
}

function setupWebGL() {
  canvas = document.getElementById("webgl");
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Falied to get the rendering context for WebGL ");
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariableToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get u_GlobalRotateMatrix");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function updateAnimationAngles() {
  const baseSpeed = 1.0;

  if (shift_click) {
    const s = baseSpeed * 5;
    g_jointy1 = 10 * Math.sin(g_seconds * s);
    g_jointy2 = 3 * Math.sin(g_seconds * s);
    g_jointy3 = 12 * Math.sin(g_seconds * s);
    g_headOffsetX = 0.1 * Math.sin(g_seconds * 12);
    g_headOffsetZ = 0.1 * Math.cos(g_seconds * 12);
  } else if (g_Ani) {
    const s2 = baseSpeed * 2;
    g_jointy1 = 10 * Math.sin(g_seconds * s2);
    g_jointy2 = 3 * Math.sin(g_seconds * s2);
    g_jointy3 = 12 * Math.sin(g_seconds * s2);
    g_headOffsetX = 0;
    g_headOffsetZ = 0;
  }
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_start_time;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function renderScene() {
  var startTime = performance.now();

  if (shift_click) {
    // randome background color for poke mode
    const t = g_seconds * 2; // frequency
    const r = 0.5 + 0.5 * Math.sin(t + 0);
    const g = 0.5 + 0.5 * Math.sin(t + 2);
    const b = 0.5 + 0.5 * Math.sin(t + 4);
    gl.clearColor(r, g, b, 1.0);
  } else {
    // normal gray
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
  }

  var globalRotMat = new Matrix4().rotate(g_CamX, 1, 0, 0);
  globalRotMat.rotate(g_CamY, 0, 1, 0);
  globalRotMat.rotate(g_CamZ, 0, 0, 1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const creeper = {
    green: [0.1, 0.6, 0.1, 1.0],
    black: [0.0, 0.0, 0.0, 1.0],
    orange: [1.0, 0.5, 0.0, 1.0],
  };

  // 19 Cube shapes & 1 Cone shape
  var body = new Cube();
  body.color = creeper.green;
  body.matrix.scale(0.3, 0.7, 0.3);
  body.matrix.translate(-0.5, -0.5, -0.5);
  body.render();

  var head = new Cube();
  head.color = creeper.green;
  head.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  head.matrix.rotate(-g_jointy3, 1, 0, 0);
  head.matrix.scale(0.4, 0.35, 0.4);
  head.matrix.translate(-0.5, 0.65, -0.5);
  head.render();

  var hat = new Cone();
  hat.color = creeper.orange;
  hat.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  hat.matrix.rotate(-g_jointy3, 1, 0, 0);
  hat.matrix = new Matrix4(head.matrix);
  hat.matrix.scale(1.25, 2.5, 1.25);
  hat.matrix.translate(0.4, 0.4, 0.4);
  hat.render();

  var face = new Cube();
  face.color = creeper.green;
  face.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  face.matrix.rotate(-g_jointy3, 1, 0, 0);
  face.matrix.scale(0.4, 0.35, 0.03);
  face.matrix.translate(-0.5, 0.65, -7);
  face.render();

  var lefteye = new Cube();
  lefteye.color = creeper.black;
  lefteye.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  lefteye.matrix.rotate(-g_jointy3, 1, 0, 0);
  lefteye.matrix.scale(0.1, 0.061, 0.04);
  lefteye.matrix.translate(-1.5, 6.7, -6.2);
  lefteye.render();

  var lefteye2 = new Cube();
  lefteye2.color = creeper.black;
  lefteye2.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  lefteye2.matrix.rotate(-g_jointy3, 1, 0, 0);
  lefteye2.matrix.scale(0.1, 0.061, 0.04);
  lefteye2.matrix.translate(-1.5, 7.1, -6.2);
  lefteye2.render();

  var righteye = new Cube();
  righteye.color = creeper.black;
  righteye.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  righteye.matrix.rotate(-g_jointy3, 1, 0, 0);
  righteye.matrix.scale(0.1, 0.061, 0.04);
  righteye.matrix.translate(0.5, 6.7, -6.2);
  righteye.render();

  var righteye2 = new Cube();
  righteye2.color = creeper.black;
  righteye2.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  righteye2.matrix.rotate(-g_jointy3, 1, 0, 0);
  righteye2.matrix.scale(0.1, 0.061, 0.04);
  righteye2.matrix.translate(0.5, 7.1, -6.2);
  righteye2.render();

  var mouth = new Cube();
  mouth.color = creeper.black;
  mouth.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  mouth.matrix.rotate(0, 1, 0, 0);
  mouth.matrix.rotate(-g_jointy3, 1, 0, 0);
  mouth.matrix.scale(0.1, 0.071, 0.04);
  mouth.matrix.translate(-0.47, 4.2, -6.1);
  mouth.render();

  var nose = new Cube();
  nose.color = creeper.black;
  nose.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  nose.matrix.rotate(0, 1, 0, 0);
  nose.matrix.rotate(-g_jointy3, 1, 0, 0);
  nose.matrix.scale(0.1, 0.075, 0.04);
  nose.matrix.translate(-0.47, 4.5, -6);
  nose.render();

  var beardLeft = new Cube();
  beardLeft.color = creeper.black;
  beardLeft.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  beardLeft.matrix.rotate(-g_jointy3, 1, 0, 0);
  beardLeft.matrix.scale(0.04, 0.11, 0.04);
  beardLeft.matrix.translate(1.3, 2.4, -6.2);
  beardLeft.render();

  var beardRight = new Cube();
  beardRight.color = creeper.black;
  beardRight.matrix.translate(g_headOffsetX, 0, g_headOffsetZ);
  beardRight.matrix.rotate(-g_jointy3, 1, 0, 0);
  beardRight.matrix.scale(0.04, 0.11, 0.04);
  beardRight.matrix.translate(-2.1, 2.4, -6.2);
  beardRight.render();

  var LeftLeg = new Cube();
  LeftLeg.color = creeper.green;
  LeftLeg.matrix.setTranslate(0, 0, 0);
  LeftLeg.matrix.rotate(-g_jointy1, 1, 0, 0);
  var LeftLegCoord = new Matrix4(LeftLeg.matrix);
  LeftLeg.matrix.scale(0.15, -0.25, 0.15);
  LeftLeg.matrix.translate(-1.0, 1.2, -2);
  LeftLeg.render();

  var RightLeg = new Cube();
  RightLeg.color = creeper.green;
  RightLeg.matrix.setTranslate(0, 0, 0);
  RightLeg.matrix.rotate(g_jointy1, 1, 0, 0);
  var RightLegCoord = new Matrix4(RightLeg.matrix);
  RightLeg.matrix.scale(0.15, -0.25, 0.15);
  RightLeg.matrix.translate(0, 1.2, -2);
  RightLeg.render();

  var BackLeftLeg = new Cube();
  BackLeftLeg.color = creeper.green;
  BackLeftLeg.matrix.setTranslate(0, 0, 0);
  BackLeftLeg.matrix.rotate(-g_jointy1, 1, 0, 0);
  var BackLeftLegCoord = new Matrix4(BackLeftLeg.matrix);
  BackLeftLeg.matrix.scale(0.15, -0.25, 0.15);
  BackLeftLeg.matrix.translate(-1.0, 1.2, 1);
  BackLeftLeg.render();

  var BackRightLeg = new Cube();
  BackRightLeg.color = creeper.green;
  BackRightLeg.matrix.setTranslate(0, 0, 0);
  BackRightLeg.matrix.rotate(g_jointy1, 1, 0, 0); // Joint 1
  var BackRightLegCoord = new Matrix4(BackRightLeg.matrix);
  BackRightLeg.matrix.scale(0.15, -0.25, 0.15);
  BackRightLeg.matrix.translate(0, 1.2, 1);
  BackRightLeg.render();

  var LeftLegShoe = new Cube();
  LeftLegShoe.color = creeper.black;
  LeftLegShoe.matrix = LeftLegCoord;
  LeftLegShoe.matrix.rotate(-g_jointy2, 1, 0, 0);
  LeftLegShoe.matrix.scale(0.1, 0.1, 0.1);
  LeftLegShoe.matrix.translate(-1.0, -6.4, -2.6);
  LeftLegShoe.render();

  var RightLegShoe = new Cube();
  RightLegShoe.color = creeper.black;
  RightLegShoe.matrix = RightLegCoord;
  RightLegShoe.matrix.rotate(g_jointy2, 1, 0, 0);
  RightLegShoe.matrix.scale(0.1, 0.1, 0.1);
  RightLegShoe.matrix.translate(0, -6.4, -2.6);
  RightLegShoe.render();

  var BackLeftLegShoe = new Cube();
  BackLeftLegShoe.color = creeper.black;
  BackLeftLegShoe.matrix = BackLeftLegCoord;
  BackLeftLegShoe.matrix.rotate(-g_jointy2, 1, 0, 0);
  BackLeftLegShoe.matrix.scale(0.1, 0.1, 0.1);
  BackLeftLegShoe.matrix.translate(-1.0, -6.4, 1.6);
  BackLeftLegShoe.render();

  var BackRightLegShoe = new Cube();
  BackRightLegShoe.color = creeper.black;
  BackRightLegShoe.matrix = BackRightLegCoord;
  BackRightLegShoe.matrix.rotate(g_jointy2, 1, 0, 0);
  BackRightLegShoe.matrix.scale(0.1, 0.1, 0.1);
  BackRightLegShoe.matrix.translate(0, -6.4, 1.6);
  BackRightLegShoe.render();

  var duration = performance.now() - startTime;
  SendTextToHTML(
    " ms:" +
      Math.floor(duration) +
      " fps: " +
      Math.floor(10000 / duration) / 10,
    "fps"
  );
}

function SendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerHTML = text;
}

function convertCoordintesEventToGL(canvas, CurrentCursor) {
  var cursor = false;
  var prev_X = -1;
  var prev_Y = -1;
  canvas.onmousedown = function (ev) {
    var x = ev.clientX,
      y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      prev_X = x;
      prev_Y = y;
      cursor = true;
    }
  };
  canvas.onmouseup = function () {
    cursor = false;
  };
  canvas.onmousemove = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    if (cursor) {
      var factor = 100 / canvas.height;
      var dx = factor * (x - prev_X);
      var dy = factor * (y - prev_Y);
      CurrentCursor[0] = Math.max(Math.min(CurrentCursor[0] + dy, 90.0), -90.0);
      CurrentCursor[1] = CurrentCursor[1] + dx;
      g_CamX = -CurrentCursor[0];
      g_CamY = -CurrentCursor[1];
    }
    (prev_X = x), (prev_Y = y);
  };
}

function main() {
  setupWebGL();
  connectVariableToGLSL();
  addActionForHtmlUI();
  //gl.clearColor(0.8, 0.8, 0.8, 1.0);
  var CurrentCursor = [g_CamX, g_CamY];
  convertCoordintesEventToGL(canvas, CurrentCursor);
  requestAnimationFrame(tick);
}
