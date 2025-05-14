class Camera {
  constructor() {
    this.eye = new Vector3([10, 0.6, 3]);
    this.at = new Vector3([10, 0, 100]);
    this.up = new Vector3([0, 1, 0]);
  }

  forward() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var f = at_Location.sub(eye_Location);
    f = f.normalize();
    this.eye = this.eye.add(f);
    this.at = this.at.add(f);
  }

  backward() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var f = at_Location.sub(eye_Location);
    f = f.normalize();
    this.at = this.at.sub(f);
    this.eye = this.eye.sub(f);
  }

  left() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var move_left_side = at_Location.sub(eye_Location);
    move_left_side = move_left_side.normalize();
    move_left_side = move_left_side.mul(-1);
    var s = Vector3.cross(move_left_side, this.up);
    s = s.normalize();
    this.at = this.at.add(s);
    this.eye = this.eye.add(s);
  }

  right() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var up_Location = new Vector3(this.up.elements);
    var move_right_side = at_Location.sub(eye_Location);
    move_right_side = move_right_side.normalize();
    var s = Vector3.cross(move_right_side, up_Location);
    s = s.normalize();
    this.at = this.at.add(s);
    this.eye = this.eye.add(s);
  }

  rotRight() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var f = at_Location.sub(eye_Location);
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(
      -5,
      this.up.elements[0],
      this.up.elements[1],
      this.up.elements[2]
    );
    var f_roation = rotationMatrix.multiplyVector3(f);
    this.at = f_roation.add(this.eye);
  }

  rotLeft() {
    var at_Location = new Vector3(this.at.elements);
    var eye_Location = new Vector3(this.eye.elements);
    var f = at_Location.sub(eye_Location);
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(
      5,
      this.up.elements[0],
      this.up.elements[1],
      this.up.elements[2]
    );
    var f_roation = rotationMatrix.multiplyVector3(f);
    this.at = f_roation.add(this.eye);
  }
  upward() {
    this.eye.elements[1] += 1;
    this.at.elements[1] += 1;
  }
  downward() {
    this.eye.elements[1] -= 1;
    this.at.elements[1] -= 1;
  }
}

