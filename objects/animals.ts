import { type Boundary, Position, Velocity } from './abstract';
import { getRandomArbitrary } from '~/utils/helpers';

export interface IAnimal {
  position: Position;
  getPixelPosition(): { x: string; y: string };
  getStyle(): { left: string; top: string };
}

export class Animal implements IAnimal {
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

  getStyle() {
    const position = this.getPixelPosition();
    return {
      left: position.x,
      top: position.y,
    };
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

export interface ICat extends IAnimal {
  speed: number;
  boundary: Boundary;
  color: string;
  randomizePosition(others: IAnimal[]): void;
  updateVelocity(newDestination: Position, otherCats: ICat[]): void;
}

const CAT_COLORS = ['black', 'orange', 'grey', 'brown'];

export class Cat extends Animal {
  private _boundary: Boundary;
  private _speed: number;
  private readonly _color: string;

  constructor(startingPosition: Position, boundary: Boundary, speed: number) {
    super(startingPosition);
    this._boundary = boundary;
    this._speed = speed;
    const randomColor = getRandomArbitrary(0, CAT_COLORS.length, true);
    console.log(`Random color index: ${randomColor}`);
    this._color = CAT_COLORS[randomColor];
  }

  get color() {
    return this._color;
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

  private isOverlapping(otherAnimal: IAnimal, newPosition: Position): boolean {
    const distance = newPosition.subtract(otherAnimal.position).getMagnitude();
    const safeDistance = otherAnimal instanceof Mouse ? 200 : 50;
    return distance < safeDistance;
  }

  randomizePosition(others: IAnimal[]) {
    let newPosition: Position;
    let attempts = 0;
    const maxAttempts = 100;
    do {
      newPosition = new Position(
        getRandomArbitrary(this._boundary.left, this._boundary.right),
        getRandomArbitrary(this._boundary.top, this._boundary.bottom),
      );
      attempts++;
    } while (
      attempts < maxAttempts &&
      others.some(animal => this.isOverlapping(animal, newPosition))
    );
    this.position = newPosition;
  }

  updateVelocity(newDestination: Position, otherCats: ICat[]) {
    const velocity = Velocity.changeDirection(this._position, newDestination, this._speed);
    let newPosition = velocity.getNewPosition(this._position);

    // Attempt to adjust the position if it overlaps with other cats
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts && otherCats.some(cat => this.isOverlapping(cat, newPosition))) {
      // Slightly adjust the position to avoid overlap
      newPosition = new Position(
        newPosition.x + getRandomArbitrary(-10, 10),
        newPosition.y + getRandomArbitrary(-10, 10),
      );
      attempts++;
    }

    this.position = newPosition;
  }
}
