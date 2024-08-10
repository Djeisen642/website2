import { type Boundary, Position, Velocity } from './abstract';

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class Animal {
  protected _position: Position;

  constructor(startingPosition: Position) {
    this._position = startingPosition;
  }

  get position() {
    return this._position;
  }

  set position(newPosition: Position) {
    this._position = newPosition;
  }

  getPixelPosition() {
    return this._position.getPixelStrings();
  }
}

export class Mouse extends Animal {
  private _hitDistance: number;

  constructor(startingPosition: Position, hitDistance: number) {
    super(startingPosition);
    this._hitDistance = hitDistance;
  }

  caughtBy(position: Position) {
    const direction = this._position.subtract(position);
    const distance = direction.getMagnitude();
    return this._hitDistance >= distance;
  }
}

export class Cat extends Animal {
  private _boundary: Boundary;
  private _speed: number;

  constructor(startingPosition: Position, boundary: Boundary, speed: number) {
    super(startingPosition);
    this._boundary = boundary;
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  get boundary() {
    return this._boundary;
  }

  set boundary(value: Boundary) {
    this._boundary = value;
    this.position = this._position; // readjust position based on new boundary
  }

  override get position() {
    return this._position;
  }

  override set position(newPosition: Position) {
    this._position = this.boundary.ensurePositionIsInside(newPosition);
  }

  randomizePosition() {
    this.position = new Position(
      getRandomArbitrary(this._boundary.left, this._boundary.right),
      getRandomArbitrary(this._boundary.top, this._boundary.bottom),
    );
  }

  updateVelocity(newDestination: Position) {
    const velocity = Velocity.changeDirection(this._position, newDestination, this._speed);
    this.position = velocity.getNewPosition(this._position);
  }
}
