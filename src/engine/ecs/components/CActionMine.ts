import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CActionMine implements IComponent {
  public static id: string = "ActionMine";
  public id: string = CActionMine.id;

  private _origin: Vect2D;
    public get origin(): Vect2D {
        return this._origin;
    }
    public set origin(value: Vect2D) {
        this._origin = value;
    }

  private _target: Vect2D;
    public get target(): Vect2D {
        return this._target;
    }
    public set target(value: Vect2D) {
        this._target = value;
    }

  private _heading: Vect2D;
    public get heading(): Vect2D {
        return this._heading;
    }
    public set heading(heading: Vect2D) {
        this._heading = heading;
    }

  private _asteroidId: string;
    public get asteroidId(): string {
        return this._asteroidId;
    }
    public set asteroidId(value: string) {
        this._asteroidId = value;
    }

  constructor(origin: Vect2D, heading: Vect2D, target: Vect2D, asteroidId: string) {
    this._origin = origin;
    this._heading = heading;
    this._target = target;
    this._asteroidId = asteroidId;
  }
}