let ctx 
let v1 = new Vector3();
let v2 = new Vector3();
let v3 = new Vector3();
let v4 = new Vector3();


function drawVector(v, color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  
  ctx.moveTo(200, 200);
  ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
  ctx.stroke();
}

function handleDrawOperationEvent() {

  v1.elements[0] = document.getElementById("v1_x").value;
  v1.elements[1] = document.getElementById("v1_y").value;
  v2.elements[0] = document.getElementById("v2_x").value;
  v2.elements[1] = document.getElementById("v2_y").value;

  const op = document.getElementById("op").value;
  const scalar = document.getElementById("scalar").value;

  // Clear canvas with a black background.
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  // Always draw only the two input vectors.
  drawVector(v1, "red");
  drawVector(v2, "blue");

  
  const operations = {
    add: function() {
        v3.set(v1).add(v2);
        drawVector(v3, "green");
    },
    sub: function() {
        v3.set(v1).sub(v2);
        drawVector(v3, "green");
    },
    mul: function() {
        v3.set(v1).mul(scalar);
        drawVector(v3, "green");
        v4.set(v2).mul(scalar);
        drawVector(v4, "green");
    },
    div: function() {
        v3.set(v1).div(scalar);
        drawVector(v3, "green");
        v4.set(v2).div(scalar);
        drawVector(v4, "green");
    },
    magnitude: function() {
        console.log("Magnitude v1:  " + v1.magnitude());
        console.log("Magnitude v2:  " + v2.magnitude());
    },
    normalize: function() {
        v3.set(v1).normalize();
        drawVector(v3, "green");
        v4.set(v2).normalize();
        drawVector(v4, "green");
    }, 
    angle: function() {
        const dot = Vector3.dot(v1, v2);
        const mag1 = v1.magnitude();
        const mag2 = v2.magnitude();
        const angle = Math.acos(dot / (mag1 * mag2)) * 180 / Math.PI;
        console.log("Angle: " + angle + "°");
    },
    area: function() {
        const area = Vector3.cross(v1, v2).magnitude() / 2;
        console.log("Area of the triangle: " + area);
    }
  };
   
  if (operations[op]) {
    operations[op]();
  } else {
    console.log("No valid operation selected");
  }
}

function main() {
  // Retrieve <canvas> element 
  const canvas = document.getElementById("example");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }
  // Get the rendering context for 2DCG 
  ctx = canvas.getContext("2d");
  handleDrawOperationEvent();
}
