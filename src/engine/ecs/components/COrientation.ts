import { MyMath } from '../../utils/MyMath';
import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class COrientation implements IComponent {
  public static id: string = "Orientation";
  public id: string = COrientation.id;

  private _angle: number; // in degrees
    public get angle(): number {
        return this._angle;
    }
    public set angle(angle: number) {
        this._angle = angle;
        this._heading = this.computeHeading();
    }

  private _heading: Vect2D;
  public get heading(): Vect2D {
    return this._heading;
  }
  public set heading(value: Vect2D) {
    this._heading = value;
  }

  constructor(angle: number) {
    this._angle = angle;
    this._heading = this.computeHeading();
  }

  private computeHeading(): Vect2D {
    return MyMath.getDirectionFromAngle(this._angle);
  }
}