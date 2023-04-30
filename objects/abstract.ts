export class Vector {
  readonly x: number;
  readonly y: number;

  constructor(vector: Vector);
  constructor(x: number, y: number);
  constructor(vectorOrX: Vector | number, y?: number) {
    if (typeof vectorOrX === 'number') {
      if (typeof y !== 'number' || Number.isNaN(y)) throw new Error('Invalid implementation');
      this.x = vectorOrX;
      this.y = y;
    } else {
      this.x = vectorOrX.x;
      this.y = vectorOrX.y;
    }
  }

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const magnitude = this.getMagnitude();
    return new Vector(this.x / magnitude, this.y / magnitude);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  subtract(v2: Vector): Vector {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }
}

export class Position extends Vector {
  getPixelStrings() {
    return {
      x: `${this.x.toFixed(3)}px`,
      y: `${this.y.toFixed(3)}px`,
    };
  }
}

export class Velocity extends Vector {
  getNewPosition(currentPosition: Position) {
    return new Position(currentPosition.x + this.x, currentPosition.y + this.y);
  }

  static changeDirection(startingPosition: Position, destinationPosition: Position, speed: number) {
    const direction = destinationPosition.subtract(startingPosition);
    const unitDirection = direction.normalize();
    return new Velocity(unitDirection.multiply(speed));
  }
}

export class Boundary {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;

  constructor(top: number, bottom: number, left: number, right: number) {
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  ensurePositionIsInside(newPosition: Position) {
    return new Position(
      Math.min(Math.max(this.left, newPosition.x), this.right),
      Math.min(Math.max(this.top, newPosition.y), this.bottom),
    );
  }

  static createBoundary(rect: DOMRect, margin: number) {
    return new Boundary(
      rect.y + margin,
      rect.y + rect.height - margin,
      rect.x + margin,
      rect.x + rect.width - margin,
    );
  }
}
