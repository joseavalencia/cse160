function drawCreeper() {
  const creeper = {
    green: [0.1, 0.6, 0.1, 1.0],
    black: [0.0, 0.0, 0.0, 1.0],
  };
  
  const 
    wx = 23,
    wy = g_set_Location + 0.2,
    wz =  24;
  // (wx, wy, wz)



  var body = new Cube();
  body.color = creeper.green;
  body.matrix.translate(wx, wy, wz);
  body.matrix.scale(0.3, 0.7, 0.3);
  body.matrix.translate(-0.5, -0.5, -0.5);
  body.drawFast();

  var head = new Cube();
  head.color = creeper.green;
  head.matrix.translate(wx, wy, wz);
  head.matrix.rotate(-g_jointy3, 1, 0, 0);
  head.matrix.scale(0.4, 0.35, 0.4);
  head.matrix.translate(-0.5, 0.65, -0.5);
  head.drawFast();

  var face = new Cube();
  face.color = creeper.green;
  face.matrix.translate(wx, wy, wz);
  face.matrix.rotate(-g_jointy3, 1, 0, 0);
  face.matrix.scale(0.4, 0.35, 0.03);
  face.matrix.translate(-0.5, 0.65, -7);
  face.drawFast();

  var lefteye = new Cube();
  lefteye.color = creeper.black;
  lefteye.matrix.translate(wx, wy, wz);
  lefteye.matrix.rotate(-g_jointy3, 1, 0, 0);
  lefteye.matrix.scale(0.1, 0.061, 0.04);
  lefteye.matrix.translate(-1.5, 6.7, -6.2);
  lefteye.drawFast();

  var lefteye2 = new Cube();
  lefteye2.color = creeper.black;
  lefteye2.matrix.translate(wx, wy, wz);
  lefteye2.matrix.rotate(-g_jointy3, 1, 0, 0);
  lefteye2.matrix.scale(0.1, 0.061, 0.04);
  lefteye2.matrix.translate(-1.5, 7.1, -6.2);
  lefteye2.drawFast();

  var righteye = new Cube();
  righteye.color = creeper.black;
  righteye.matrix.translate(wx, wy, wz);
  righteye.matrix.rotate(-g_jointy3, 1, 0, 0);
  righteye.matrix.scale(0.1, 0.061, 0.04);
  righteye.matrix.translate(0.5, 6.7, -6.2);
  righteye.drawFast();

  var righteye2 = new Cube();
  righteye2.color = creeper.black;
  righteye2.matrix.translate(wx, wy, wz);
  righteye2.matrix.rotate(-g_jointy3, 1, 0, 0);
  righteye2.matrix.scale(0.1, 0.061, 0.04);
  righteye2.matrix.translate(0.5, 7.1, -6.2);
  righteye2.drawFast();

  var mouth = new Cube();
  mouth.color = creeper.black;
  mouth.matrix.translate(wx, wy, wz);
  mouth.matrix.rotate(0, 1, 0, 0);
  mouth.matrix.rotate(-g_jointy3, 1, 0, 0);
  mouth.matrix.scale(0.1, 0.071, 0.04);
  mouth.matrix.translate(-0.47, 4.2, -6.1);
  mouth.drawFast();

  var nose = new Cube();
  nose.color = creeper.black;
  nose.matrix.translate(wx, wy, wz);
  nose.matrix.rotate(0, 1, 0, 0);
  nose.matrix.rotate(-g_jointy3, 1, 0, 0);
  nose.matrix.scale(0.1, 0.075, 0.04);
  nose.matrix.translate(-0.47, 4.5, -6);
  nose.drawFast();

  var beardLeft = new Cube();
  beardLeft.color = creeper.black;
  beardLeft.matrix.translate(wx, wy, wz);
  beardLeft.matrix.rotate(-g_jointy3, 1, 0, 0);
  beardLeft.matrix.scale(0.04, 0.11, 0.04);
  beardLeft.matrix.translate(1.3, 2.4, -6.2); // (x,y,z)
  beardLeft.drawFast();

  var beardRight = new Cube();
  beardRight.color = creeper.black;
  beardRight.matrix.translate(wx, wy, wz);
  beardRight.matrix.rotate(-g_jointy3, 1, 0, 0);
  beardRight.matrix.scale(0.04, 0.11, 0.04);
  beardRight.matrix.translate(-2.1, 2.4, -6.2);

  beardRight.drawFast();

  var LeftLeg = new Cube();
  LeftLeg.color = creeper.green;
  LeftLeg.matrix.translate(wx, wy, wz); // called on animation 
  LeftLeg.matrix.rotate(-g_jointy1, 1, 0, 0); // Joint 1
  var LeftLegCoord = new Matrix4(LeftLeg.matrix);
  LeftLeg.matrix.scale(0.15, -0.25, 0.15);
  LeftLeg.matrix.translate(-1.0, 1.25, -2); //1.2
  LeftLeg.drawFast();

  var RightLeg = new Cube();
  RightLeg.color = creeper.green;
  RightLeg.matrix.translate(wx, wy, wz);
  RightLeg.matrix.rotate(g_jointy1, 1, 0, 0); // Joint 1
  var RightLegCoord = new Matrix4(RightLeg.matrix);
  RightLeg.matrix.scale(0.15, -0.25, 0.15);
  RightLeg.matrix.translate(0, 1.2, -2);
  RightLeg.drawFast();

  var BackLeftLeg = new Cube();
  BackLeftLeg.color = creeper.green;
  BackLeftLeg.matrix.translate(wx, wy, wz);
  BackLeftLeg.matrix.rotate(-g_jointy1, 1, 0, 0); // Joint 1
  var BackLeftLegCoord = new Matrix4(BackLeftLeg.matrix);
  BackLeftLeg.matrix.scale(0.15, -0.25, 0.15);
  BackLeftLeg.matrix.translate(-1.0, 1.2, 1);
  BackLeftLeg.drawFast();

  var BackRightLeg = new Cube();
  BackRightLeg.color = creeper.green;
  BackRightLeg.matrix.translate(wx, wy, wz);
  BackRightLeg.matrix.rotate(g_jointy1, 1, 0, 0); // Joint 1
  var BackRightLegCoord = new Matrix4(BackRightLeg.matrix);
  BackRightLeg.matrix.scale(0.15, -0.25, 0.15);
  BackRightLeg.matrix.translate(0, 1.2, 1);
  BackRightLeg.drawFast();

  var LeftLegShoe = new Cube();
  LeftLegShoe.color = creeper.black;
  LeftLegShoe.matrix.translate(wx, wy, wz);
  LeftLegShoe.matrix = LeftLegCoord;
  LeftLegShoe.matrix.rotate(-g_jointy2, 1, 0, 0);
  LeftLegShoe.matrix.scale(0.1, 0.1, 0.1);
  LeftLegShoe.matrix.translate(-1.0, -6.4, -2.6);
  LeftLegShoe.drawFast();

  var RightLegShoe = new Cube();
  RightLegShoe.color = creeper.black;
  RightLegShoe.matrix.translate(wx, wy, wz);
  RightLegShoe.matrix = RightLegCoord;
  RightLegShoe.matrix.rotate(g_jointy2, 1, 0, 0);
  RightLegShoe.matrix.scale(0.1, 0.1, 0.1);
  RightLegShoe.matrix.translate(0, -6.4, -2.6);
  RightLegShoe.drawFast();

  var BackLeftLegShoe = new Cube();
  BackLeftLegShoe.color = creeper.black;
  BackLeftLegShoe.matrix.translate(wx, wy, wz);
  BackLeftLegShoe.matrix = BackLeftLegCoord;
  BackLeftLegShoe.matrix.rotate(-g_jointy2, 1, 0, 0);
  BackLeftLegShoe.matrix.scale(0.1, 0.1, 0.1);
  BackLeftLegShoe.matrix.translate(-1.0, -6.4, 1.6);
  BackLeftLegShoe.drawFast();

  var BackRightLegShoe = new Cube();
  BackRightLegShoe.color = creeper.black;
  BackRightLegShoe.matrix.translate(wx, wy, wz);
  BackRightLegShoe.matrix = BackRightLegCoord;
  BackRightLegShoe.matrix.rotate(g_jointy2, 1, 0, 0);
  BackRightLegShoe.matrix.scale(0.1, 0.1, 0.1);
  BackRightLegShoe.matrix.translate(0, -6.4, 1.6);
  BackRightLegShoe.drawFast();
}
