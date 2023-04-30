import { Boundary, Position, Velocity } from './abstract';

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
export class Mouse extends Animal {}

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

  // eslint-disable-next-line accessor-pairs
  set position(newPosition: Position) {
    this._position = this.boundary.ensurePositionIsInside(newPosition);
  }

  updateVelocity(newDestination: Position) {
    const velocity = Velocity.changeDirection(this._position, newDestination, this._speed);
    this.position = velocity.getNewPosition(this._position);
  }
}
