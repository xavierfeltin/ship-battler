import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CActionFire implements IComponent {
  public static id: string = "ActionFire";
  public id: string = CActionFire.id;

  private _origin: Vect2D;
    public get origin(): Vect2D {
        return this._origin;
    }
    public set origin(value: Vect2D) {
        this._origin = value;
    }

    private _angle: number;
  public get angle(): number {
    return this._angle;
  }
  public set angle(value: number) {
    this._angle = value;
  }
    /*
  private _heading: Vect2D;
    public get heading(): Vect2D {
        return this._heading;
    }
    public set heading(heading: Vect2D) {
        this._heading = heading;
    }
    */
  constructor(origin: Vect2D, angle: number) {
    this._origin = origin;
    //this._heading = heading;
    this._angle = angle;
  }
}