class Cone {
  constructor(height = 0.4, radius = 0.25, segments = 24) {
    this.color = [1.0, 1.0, 1.0, 1.0]; // default white
    this.matrix = new Matrix4();
    this.height = height;
    this.radius = radius;
    this.segments = segments;
  }

  render() {
    // send the color and current transform
    const rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    const H = this.height;
    const R = this.radius;
    const S = this.segments;

    // draw base cap and side walls
    for (let i = 0; i < S; i++) {
      const theta1 = (2 * Math.PI * i) / S;
      const theta2 = (2 * Math.PI * (i + 1)) / S;
      const x1 = R * Math.cos(theta1),
        z1 = R * Math.sin(theta1);
      const x2 = R * Math.cos(theta2),
        z2 = R * Math.sin(theta2);

      // base cap (facing down): flip winding so it’s invisible from above
      drawTriangle3D([0, 0, 0, x2, 0, z2, x1, 0, z1]);

      // side wall
      drawTriangle3D([x1, 0, z1, x2, 0, z2, 0, H, 0]);
    }
  }
}
