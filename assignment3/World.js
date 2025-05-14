// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor; }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0); }
    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);}
    else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); }
    else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV); }
    else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV); }
    else { 
      gl_FragColor = vec4(1, .2, .2, 1);
    }
  }
  `;


let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix
let u_whichTexture;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;

let g_CalltheCreeper = false;
//let g_migong = false;
let g_Animation = false;
let g_set_Location = 0;
let Shift_and_Click = false;

var g_vertexBufferCube = null;
var g_jointy1 = 0; // legs 
var g_jointy3 = 0; // head 
var g_jointy2 = 0; // toes


let g_global_block = true;
let g_CamX = 0;
let g_CamY = 0;
let g_CamZ = 0;

var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
let g_camera = new Camera();




function setupCanvas() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}); // gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  // get the storage location of u_Sample0
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_sampler0');
    return false;
  }
  // get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_sampler1');
    return;
  }
  // get the storage location of u_Sampler1
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_sampler2');
    return;
  }
  // get the storage location of u_Sampler
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_sampler3');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function addActionForHtmlUI() {
    document.getElementById('Animate').onclick = function () {
        g_Animation = !g_Animation
    };
    document.getElementById('CallTheCreeper').onclick = function () {
        g_CalltheCreeper = !g_CalltheCreeper
    };
}


function initTextures() {
    // image 0
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image0 object');
        return false;
    }

    image0.onload = function () {
        sendTextureToTEXTURE0(image0);
    };

    if (g_global_block === true) {
        image0.src = 'brick-wall.jpg';
    }
    // brick-wall textureNum = 0
    // sky textureNum = 1
    // grass textureNum = 2
    // dark-wodd textureNum = 3

    // image 1
    var image1 = new Image();
    if (!image1) {
        console.log('Failed to create the image1 object');
        return false;
    }

    image1.onload = function () {
        sendTextureToTEXTURE1(image1);
    };

    if (g_global_block === true) {
        image1.src = 'skyy.jpeg';
    }

    //image 2
    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
        return false;
    }
    image2.onload = function () {
        sendTextureToTEXTURE2(image2);
    };
    if (g_global_block === true) {
        image2.src = 'grass.png';
        
    }

    // image 3
    var image3 = new Image();
    if (!image3) {
        console.log('Failed to create the image3 object');
        return false;
    }

    image3.onload = function () {
        sendTextureToTEXTURE3(image3);
    };

    if (g_global_block === true) {
        image3.src = 'dark-woodv2.jpg';
    }
    
}

function sendTextureToTEXTURE0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture0 object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler0, 0);
    console.log("successfully render the sky.jpg")
}

function sendTextureToTEXTURE1(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture1 object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);
    console.log("successfully render the Wood-plank.png")
}

function sendTextureToTEXTURE2(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture2 object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler2, 2);
    console.log("successfully render the brick-wall.jpg")
}

function sendTextureToTEXTURE3(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture3 object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler3, 3);
    console.log("successfully render the dark-woodv2.jpg")
}



function main() {
  setupCanvas();
  connectVariablesToGLSL();
  addActionForHtmlUI();
  initTextures();
  document.onkeydown = keydown;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  var CurrentCursor = [g_CamX, g_CamY];
  initEventHandlers(canvas, CurrentCursor);
  requestAnimationFrame(tick);
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_start_time;
  updateAnimation();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimation() {
  if (g_Animation) {
    g_set_Location = ((Math.sin(g_seconds * 3)) / 30) - (.3);
    g_jointy1 = 10 * Math.sin(g_seconds); // legs 
    g_jointy3 = 12 * Math.sin(g_seconds); // head
    g_jointy2 = 3 * Math.sin(g_seconds); // shoes 
  }
}


function keydown(ev) {
  if (ev.keyCode === 68) {
      g_camera.right();
  } else if (ev.keyCode === 65) {
      g_camera.left();
  } else if (ev.keyCode === 87) {
      g_camera.forward();
  } else if (ev.keyCode === 83) {
      g_camera.backward();
  } else if (ev.keyCode === 69) {
      g_camera.rotRight();
  } else if (ev.keyCode === 81) {
      g_camera.rotLeft();
  } else if (ev.keyCode === 38) {
      g_camera.upward();
  } else if (ev.keyCode === 40) {
      g_camera.downward();
  } else if (ev.keyCode === 88) {
    breakBlock();
  } else if (ev.keyCode === 90) {
    placeBlock();
  }
  renderScene();
}


function breakBlock() {
  let dir    = new Vector3(g_camera.at.elements);
  dir.sub(g_camera.eye).normalize();
  let worldX = g_camera.eye.elements[0] + dir.elements[0] * 1.5;
  let worldZ = g_camera.eye.elements[2] + dir.elements[2] * 1.5;
  let ix = Math.floor(worldZ + 4), iy = Math.floor(worldX + 4);

  // only tear down if above initial height
  if (
    ix>=0 && ix<32 && iy>=0 && iy<32 &&
    g_map[ix][iy] > g_initialMap[ix][iy]
  ) {
    g_map[ix][iy]--;
  }
}


function placeBlock() {
  let dir = new Vector3(g_camera.at.elements);
  dir.sub(g_camera.eye).normalize();
  let worldX = g_camera.eye.elements[0] + dir.elements[0] * 1.5;
  let worldZ = g_camera.eye.elements[2] + dir.elements[2] * 1.5;

  let ix = Math.floor(worldZ + 4);
  let iy = Math.floor(worldX + 4);

  if (ix >= 0 && ix < 32 && iy >= 0 && iy < 32 && g_map[ix][iy] < 8) {
    g_map[ix][iy]++;
  }
}


function renderScene() {
  var startTime = performance.now();
  // Pass the project matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  // Pass the global rotate matrix
  var globalRotMat = new Matrix4().rotate(g_CamX, 1, 0, 0)
  globalRotMat.rotate(g_CamY, 0, 1, 0);
  globalRotMat.rotate(g_CamZ, 0, 0, 1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  var duration = performance.now() - startTime;
  SendTextToHTML(" ms:" + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");
  drawSetting();
  drawMap();
  if (g_CalltheCreeper) {
    drawCreeper();
  }
}


function SendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerHTML = text;
}

function drawSetting() {
  var ground = new Cube();
  ground.textureNum = 2;
  ground.matrix.translate(-0, -.75, -0);
  ground.matrix.scale(35, .01, 35);
  ground.matrix.translate(-.15, 0, -.15);
  ground.drawFast();

  var sky = new Cube();
  sky.color = [0, 0.95, 1, 1];
  sky.textureNum = 1;
  sky.matrix.translate(-1, 0, -1);
  sky.matrix.scale(100, 100, 100);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.drawFast();
}


let g_map = [
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4,], // here
  [4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4,],
  [4, 4, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 4,],
  [4, 4, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 4,], // end of section 1 & start of section 2
  [4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 4, 4, 0, 0, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 0, 4,],
  [4, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, 4,],
  [4, 0, 0, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, 4,],
  [4, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4,],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,],
];

const g_initialMap = g_map.map(row => row.slice());

function drawMap() {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      const baseH = g_initialMap[x][y];
      const H     = g_map[x][y];
      for (let z = 0; z < H; z++) {
        let c = new Cube();

        if (z < baseH) {
          // your existing terrain:
          if      (baseH === 0) c.textureNum = 0;
          else if (baseH === 1) c.textureNum = 2;
          else                  c.textureNum = 0;
        } else {
          c.textureNum = 3;
        }

        c.matrix.translate(y - 4, z - 0.75, x - 4);
        c.drawFast();
      }
    }
  }
}


function initEventHandlers(canvas, CurrentCursor) {
  var cursor = false;
  var prev_X = -1, 
  prev_Y = -1;
  canvas.onmousedown = function (ev) {
    var x = ev.clientX, y = ev.clientY;
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
    var x = ev.clientX
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
