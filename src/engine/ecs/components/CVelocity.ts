import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CVelocity implements IComponent {
  public static id: string = "Velocity";
  public id: string = CVelocity.id;

  private _value: Vect2D;
    public get value(): Vect2D {
        return this._value;
    }
    public set value(value: Vect2D) {
        this._value = value;
    }

  constructor(v: Vect2D) {
    this._value = v;
  }
}