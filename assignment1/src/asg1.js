var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 20.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`
 

// Gloabl variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let circle_segment = 10;
var interval = null; 

function setupWebGL() {

  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

}

function connectVariablesToGLSL() {
  // initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.error("Failed to get the storage location of u_Size");
    return;
  }

}

// constants 
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

function addActionsForHtmlUI() {

  document.getElementById('clearButton').onclick = function() { 
    stopScatterAnimation();
    g_shapesList =[]; 
    renderAllShapes(); };

  //draw picture
  document.getElementById('drawButton').onclick = function() { stopScatterAnimation(); 
  drawCatPicture(); };

  // scatter button
  document.getElementById('scatterButton').onclick = function() {
    // Toggle scatter animation
    if (interval === null) {
      ScatterAnimation();
    } else {
      stopScatterAnimation();
    }
  };

  // shape type
  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT};
  document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE};
  document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE};

  // slider events
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value/100; });

  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value/100; });

  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value/100; });

  // size slider & circle segment
  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value; });
  // segment 
  document.getElementById('circleSegSlide').addEventListener('mouseup', function () { circle_segment = this.value; });

}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // black
  //gl.clearColor(1.0, 1.0, 1.0, 1.0); // white 

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);


}

var g_shapesList = [];

function click(ev) {

  let [x,y] = convertCoordintesEventToGL(ev);

  //let point = new Point();
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = circle_segment;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;

  g_shapesList.push(point);

  renderAllShapes();
}


function convertCoordintesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}

function renderAllShapes() {

  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}


function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML ");
    return;
  }
  htmlElm.innerHTML = text;
}

// Awesomeness! 
function ScatterAnimation() {
  for (let i = 0; i < g_shapesList.length; i++) {
    let shape = g_shapesList[i];
    if (shape.vx == undefined) {
      shape.vx = (Math.random() - 0.5) * 0.02;
      shape.vy = (Math.random() - 0.5) * 0.02;
    }
  }
  interval = setInterval(() => { 
    for (let i = 0; i < g_shapesList.length; i++) {
      let shape = g_shapesList[i];
      shape.position[0] += shape.vx;
      shape.position[1] += shape.vy;
    }
    renderAllShapes();
  }, 30);
}

function stopScatterAnimation() {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
}
