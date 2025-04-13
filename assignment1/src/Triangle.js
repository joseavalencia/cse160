class Triangle{
    constructor() {
      this.type='triangle';
      this.position=[0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
    
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      gl.uniform1f(u_Size, size);
  
      // Draw
      //gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size/200;
      const [x, y] = xy;
      const half = d / 2;
      drawTriangle([x, y + half, x + half, y - half, x - half, y - half]);
    }

}

function drawTriangle(vertices) {
    var n = 3; // num of vertices
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}
