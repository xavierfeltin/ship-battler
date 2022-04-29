import { IComponent } from '../IComponent';
import { Vect2D } from '../../utils/Vect2D';

export class CTarget implements IComponent {
  public static id: string = "Target";
  public id: string = CTarget.id;

  private _value: Vect2D;
    public get value(): Vect2D {
        return this._value;
    }
    public set value(value: Vect2D) {
        this._value = value;
    }

  constructor(pos: Vect2D) {
    this._value = pos;
  }
}