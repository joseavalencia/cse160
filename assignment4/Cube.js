class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
    this.vertex = [
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      1.0, 0.0, 1.0,
    ];
  }

  drawCube() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0],
      [0, 0, 1, 1, 0, 1]
    );

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.7,
      rgba[1] * 0.7,
      rgba[2] * 0.7,
      rgba[3]
    );

    drawTriangle3DUV(
      [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      [0, 0, 0, 1, 1, 1]
    );
    drawTriangle3DUV(
      [0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.6,
      rgba[1] * 0.6,
      rgba[2] * 0.6,
      rgba[3]
    );

    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0],
      [0, 0, 0, 1, 1, 1]
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    drawTriangle3DUV(
      [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangle3DUV(
      [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      [0, 0, 0, 1, 1, 1]
    );

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );

    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0],
      [0, 0, 1, 1, 0, 1]
    );
    drawTriangle3DUV(
      [1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangle3DUV(
      [1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
      [0, 0, 1, 1, 0, 1]
    );
  }

  drawFast() {
    gl.uniform1i(u_whichTexture, this.textureNum);
    const [r, g, b, a] = this.color;
    gl.uniform4f(u_FragColor, r, g, b, a);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
    const faceVerts = [
      [0,0,0, 1,1,0, 1,0,0, 0,0,0, 0,1,0, 1,1,0], // front
      [0,0,1, 1,1,1, 1,0,1, 0,0,1, 0,1,1, 1,1,1], // back
      [0,1,0, 0,1,1, 1,1,1, 0,1,0, 1,1,1, 1,1,0], // top 
      [0,0,0, 0,0,1, 1,0,1, 0,0,0, 1,0,1, 1,0,0], // bottom
      [1,1,0, 1,1,1, 1,0,0, 1,0,0, 1,1,1, 1,0,1], //right
      [0,1,0, 0,1,1, 0,0,0, 0,0,0, 0,1,1, 0,0,1], // left
    ];
    const Verts = faceVerts.flat();

    const faceUVs = [
      [0,0, 1,1, 1,0, 0,0, 0,1, 1,1],  // front
      [0,0, 1,1, 1,0, 0,0, 0,1, 1,1],  // back
      [0,0, 0,1, 1,1, 0,0, 1,1, 1,0],  // top
      [0,0, 0,1, 1,1, 0,0, 1,1, 1,0],  // bottom
      [0,0, 0,1, 1,1, 0,0, 1,1, 1,0],  // right
      [0,0, 0,1, 1,1, 0,0, 1,1, 1,0],  // left
    ];
    const UVs = faceUVs.flat();

    const faceNormals = [
      [0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1], // front
      [0,0, 1, 0,0, 1, 0,0, 1, 0,0, 1, 0,0, 1, 0,0, 1], // back
      [0,1, 0, 0,1, 0, 0,1, 0, 0,1, 0, 0,1, 0, 0,1, 0], // top
      [0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0], // bottom
      [1,0, 0, 1,0, 0, 1,0, 0, 1,0, 0, 1,0, 0, 1,0, 0], // right
      [-1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0], // left
    ];
    const Normals = faceNormals.flat();

    drawTriangle3DUVNormal(Verts, UVs, Normals);
  }
  
}
