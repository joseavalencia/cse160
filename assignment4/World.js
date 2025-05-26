// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  //uniform sampler2D u_Sampler3; // might not need
  uniform int u_whichTexture;
  uniform vec3 u_lightPos; 
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightColorsolor;
  uniform int u_light;
  uniform int u_lightColors;
  uniform vec3 u_spotLightPos;
  varying vec4 v_VertPos;

  void main() {
    if(u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);}
    else if(u_whichTexture == -2){
      gl_FragColor = u_FragColor; }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV,1.0,1.0);}
    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); }
    else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); }
    else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV); }
    else { 
      gl_FragColor = vec4(1, .2, .2, 1);
    }
    if (u_light == 1) {
      vec3 lightVector = u_lightPos - vec3(v_VertPos);
      float r = length(lightVector);
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);

      vec3 R = reflect(-L, N);
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
      float specular = pow(max(dot(E, R), 0.0), 100.0);

      vec3 diffuse = vec3(gl_FragColor) * nDotL;
      vec3 ambient = vec3(gl_FragColor) * 0.3;

      if(u_whichTexture == 0 || u_whichTexture == 1 || u_whichTexture == -2)
        specular = 0.0;

      if(u_lightColors == 0){
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(u_lightColorsolor * (diffuse + ambient), 1.0);
      }
    } else if (u_light == 2) {
      vec3 lightVector = u_spotLightPos - vec3(v_VertPos);
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = dot(N, L);

      float spotLightFactor = 1.0;
      vec3 D = -vec3(0, -1, 0);
      float spotLightCos = dot(D, L);
      float spotLightCosMax = 0.98;

      if (spotLightCos >= spotLightCosMax) {
        spotLightFactor = pow(spotLightCos, 2.0);
      } else {
        spotLightFactor = 0.0;
      }

      if(dot(N, L) <= 0.0){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      } else {
        vec3 diffuse = vec3(gl_FragColor) * nDotL;
        vec3 ambient = vec3(gl_FragColor) * 0.3;
        vec3 reflection = dot(L, N) * u_lightColorsolor * diffuse;

        vec3 R = reflect(-L, N);
        vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
        float specular = pow(max(dot(E, R), 0.0), 100.0);

        if(dot(R, E) > 0.0){
          float RegularFactor = pow(dot(R, E), 2.0);
          reflection += RegularFactor * specular * u_lightColorsolor;
        }

        vec3 color = spotLightFactor * reflection;
        gl_FragColor = vec4(color, 1.0);
      }
    }
  }`;
    
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

let g_set_Location = 0;

let a_Normal = false;

let u_spotLightPos;
let u_light;
let u_lightColors;
let u_lightColorsolor;
let u_cameraPos;
let u_lightPos;
 

let g_normalOnOff = false; 
let g_lightPos = [10,3,12];
let g_lightMoveOnOff = false; 
let g_lightColor = [1,1,1,1];

let g_spotlightPos = [8, g_set_Location+0.2, 9];


let g_CalltheCreeper = true;
let g_Animation = false;

let Shift_and_Click = false;

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
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }
  u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
  if (!u_spotLightPos) {
    console.log('Failed to get the storage location of u_spotLightPos');
    return;
  }
  u_lightColorsolor = gl.getUniformLocation(gl.program, 'u_lightColorsolor');
  if (!u_lightColorsolor) {
    console.log('Failed to get the storage location of u_lightColorsolor');
    return;
  }
  u_light = gl.getUniformLocation(gl.program, 'u_light'); 
  if (!u_light) {
    console.log('Failed to get the storage location of u_light');
    return; 
  }
  u_lightColors = gl.getUniformLocation(gl.program, 'u_lightColors');
  if (!u_lightColors) {
    console.log('Failed to get the storage location of u_lightColors');
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
  // Normal light On/Off
  document.getElementById('NormalOnOff').onclick = function () {
    g_normalOnOff = !g_normalOnOff;
  };
  //Light Sliders 
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[0] = this.value/100; renderScene();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[1] = this.value/100; renderScene();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[2] = this.value/100; renderScene();}});

  // light move animation 
  document.getElementById('LightAnimationOn').onclick = function (ev) {
    g_lightMoveOnOff = true;
    renderScene();
  };
  document.getElementById('LightAnimationOff').onclick = function (ev) {
    g_lightMoveOnOff = false;
    renderScene();
  };

  // Light ON / OFF 
  document.getElementById('LightsOn').onclick = function () {
    gl.uniform1i(u_light, 1);
  };
  document.getElementById('LightsOff').onclick = function () {
    gl.uniform1i(u_light, 0);
    gl.uniform1i(u_lightColors, 0);
    g_lightColor = [1,1,1];
    document.getElementById('lightRed').value = g_lightColor[0] * 255;
    document.getElementById('lightGreen').value = g_lightColor[1] * 255;
    document.getElementById('lightBlue').value = g_lightColor[2] * 255;
  };
  // Spotlight ON / OFF
  document.getElementById('Spot_light_on').onclick = function () {
    gl.uniform1i(u_light, 2);
  };
  document.getElementById('Spot_light_off').onclick = function () {
    gl.uniform1i(u_light, 0);
    gl.uniform1i(u_lightColors, 0);
    g_lightColor = [1,1,1];
    document.getElementById('lightRed').value = g_lightColor[0] * 255;
    document.getElementById('lightGreen').value = g_lightColor[1] * 255;
    document.getElementById('lightBlue').value = g_lightColor[2] * 255;
  };

  // Light Color Sliders
  document.getElementById('lightRed').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      gl.uniform1i(u_lightColors, 1);
      g_lightColor[0] = this.value / 100;
    }
  });
  document.getElementById('lightGreen').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      gl.uniform1i(u_lightColors, 1);
      g_lightColor[1] = this.value / 100;
    }
  });
  document.getElementById('lightBlue').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      gl.uniform1i(u_lightColors, 1);
      g_lightColor[2] = this.value / 100;
    }
  });

  // Spotlight Sliders
  document.getElementById('SpotlightSlideX').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      g_spotlightPos[0] = this.value / 15;
    }
  });
  document.getElementById('SpotlightSlideY').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      g_spotlightPos[1] = this.value / 15;
    }
  });
  document.getElementById('SpotlightSlideZ').addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1) {
      g_spotlightPos[2] = this.value / 15;
    }
  });
}

function initTextures() {
 
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
  console.log("successfully rendered the sampler0 texture")
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
  console.log("successfully rendered the sampler1 texture")
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
  console.log("successfully rendered the sampler2 texture")
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
  if (g_lightMoveOnOff) { // rotating around and spawn location
    const r = 5.0;
    g_lightPos[0] =  10 + r * Math.cos(g_seconds);   
    g_lightPos[2] =   7 + r * Math.sin(g_seconds);   
    g_lightPos[1] =  3 +      Math.sin(g_seconds*2); 
    g_spotlightPos[0] = g_lightPos[0];
    g_spotlightPos[1] = g_lightPos[1];
    g_spotlightPos[2] = g_lightPos[2];
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
  } 
  renderScene();
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

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]); 
  gl.uniform3f(u_spotLightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  gl.uniform3f(u_lightColorsolor, g_lightColor[0], g_lightColor[1], g_lightColor[2]); 
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]); 

  drawSetting();
  if (g_CalltheCreeper) {
    drawCreeper();
  }

  var duration = performance.now() - startTime;
  SendTextToHTML(" ms:" + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");
}


function SendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerHTML = text;
}

function drawSetting() {
  // render my grass png
  var ground = new Cube();
  ground.textureNum = 2;
  if (g_normalOnOff) {
    ground.textureNum = -3; 
  }
  ground.matrix.translate(-0, -.75, -0);
  ground.matrix.scale(35, .01, 35);
  ground.matrix.translate(0, -0.5, 0);
  ground.drawFast();

  var light = new Cube();
  light.color = [3,5,0,1];
  if (g_normalOnOff) {
    light.textureNum = -3; 
  }
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(.5, .5, .5);
  light.matrix.translate(-.3, -.3, -.3);
  light.drawFast();

  var skyy = new Cube();
  skyy.textureNum = 1; 
  if (g_normalOnOff) {
    skyy.textureNum = -3; 
  }
  skyy.matrix.translate(0, 0, 0);
  skyy.matrix.scale(20, 20, 20);
  skyy.matrix.translate(0, -.5, 0);
  skyy.drawFast();
  
  var sp = new Sphere();
  sp.color = [0, 1, 0, 1];
  if (g_normalOnOff) {
    sp.textureNum = -3; 
  }
  sp.matrix.translate(12,1,12);
  sp.render();
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
