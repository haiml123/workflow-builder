export class Point {

  constructor(public x: number = 0, public y: number = 0) {
  }

  clone() {
    return new Point(this.x, this.y);
  }

  // @ts-ignore
  pointPlus(x: number = null, y: number = null) {
    const newPoint = this.clone();
    if(x) {
      newPoint.x += x;
    }
    if(y) {
      newPoint.y += y;
    }
    return newPoint;
  }

  isInXrange(p1: Point, p2: Point) {
    return p1.x < this.x && p2.x > this.x;
  }
  isInYrange(p2: Point, p3: Point) {
    return p2.y < this.x && p3.y > this.y;
  }
}
