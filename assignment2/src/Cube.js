class Cube {
  constructor() {
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    // pass color of a point to u_FragColor uniform variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    // front
    drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);

    // back
    drawTriangle3D([1, 0, 1, 0, 1, 1, 0, 0, 1]);
    drawTriangle3D([1, 0, 1, 1, 1, 1, 0, 1, 1]);

    // left
    drawTriangle3D([0, 0, 1, 0, 1, 0, 0, 0, 0]);
    drawTriangle3D([0, 0, 1, 0, 1, 1, 0, 1, 0]);

    // right
    drawTriangle3D([1, 0, 0, 1, 1, 1, 1, 0, 1]);
    drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);

    // top
    drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);

    // bottom
    drawTriangle3D([0, 0, 0, 1, 0, 1, 0, 0, 1]);
    drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 0, 1]);
  }
}
