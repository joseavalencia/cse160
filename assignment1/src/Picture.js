function drawCatPicture() {    
    g_shapesList = [];
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Scale and offsets
    let catScale   = 13;  
    let catOffsetX = -0.33;
    let catOffsetY = -0.46;
  
    // colors
    let background = [15.0, 14.75, 0.8];    
    let catBlack   = [0.05, 0.05, 0.05];   
    let catBrown   = [0.25, 0.15, 0.10];   
    let catOrange  = [0.60, 0.33, 0.20];   
    let ribbonPink = [1.0, 0.7, 0.8];        

    let triangles = [
      [-100, -100, -100, 100, 100, 100, background],
      [-100, -100, 100, 100, 100, -100, background],
  
      // Cat lower body 
      [5,7, 4,8, 5,10, catBlack],
      [2,8, 4,8, 5,10, catOrange],
      [2,8, 5,10, 2,10, catBlack],
      [4,0, 4,6, 9,6, catBlack],
      [4,0, 9,6, 9,0, catBlack],
  
      // Cat Back 
      [5,6, 9,6, 9,7, catBlack],
      [5,6, 9,7, 8.75,8.5, catBrown],  
      [5,6, 8.75,8.5, 7.5,9.75, catBlack],
      [5,6, 7.5,9.75, 6,10, catOrange], 
      [5,6, 6,10, 5,10, catBlack],
  
      // Cat chest
      [2,0, 4,0, 2,1, catBrown],
      [4,0, 2,1, 4,1, catBlack],
      [2,1, 4,1, 3,1.5, catOrange],
      [3,1.5, 4,1, 5,1.5, catBlack],
      [3,1.5, 5,1.5, 3,6, catBlack],
      [5,1.5, 3,6, 5,7, catBrown],
      [3,6, 5,7, 2,7, catOrange],
      [5,7, 2,7, 4,8, catBlack],
      [2,7, 4,8, 2,8, catBlack],
  
      // Cat tail
      [9,1, 9,-1, 10,-1, catBlack],
      [9,1, 10,-1, 10,1, catOrange],
      [9,-1, 9,-3, 10,-3, catOrange],
      [9,-1, 10,-3, 10,-1, catBlack],
      [9,-1, 9,-3, 7,-3, catBlack],
    
      // Cat head
      [1,10, 5,10, 5,11, ribbonPink],
      [1,10, 2,10, 3,6, ribbonPink],
      [1,10, 2,10, 1,6, ribbonPink],
      [-0.50, 10, -0.50,9, 2,9.5, ribbonPink],
      [4, 10, 4,9, 1,9.5, ribbonPink],
      [1,10, 5,11, 4.75,12.5, catBlack],
      [1,10, 4.75,12.5, 3.5,13.75, catBrown],
      [1,10, 3.5,13.75, 2,14, catBlack],
      [1,10, 2,14, 1,14, catBlack],
  
      // Cat face 
      [1,12.5, 1,10,   0.3,10.3, catBlack],
      [1,12.5, 0.3,10.3, 0,11,   catBlack],
      [1,12.5, 0,11,    0,11.5,  catOrange],
  
      // Cat ears 
      [1.50,13, 2.50,13, 1.50,15, catBlack],
      [2.75,13, 3.75,13, 2.75,15, catBlack],

    ];
  
    const vertices = new Float32Array(6);
    for (let i = 0; i < triangles.length; i++) {
      const tri = triangles[i];
      let divisor, offsetX = 0.0, offsetY = 0.0;
      if (i < 2) {
        divisor = 100;
      } else {
        divisor = catScale;
        offsetX = catOffsetX;
        offsetY = catOffsetY;
      }
      for (let j = 0; j < 6; j += 2) {
        let x = tri[j] / divisor;
        let y = tri[j + 1] / divisor;
        x += offsetX;
        y += offsetY;
        vertices[j] = x;
        vertices[j+1] = y;
      }
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const [r, g, b] = tri[6];
      gl.uniform4f(u_FragColor, r, g, b, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    sendTextToHTML("Cat Picture Drawn", "numdot");
  }
