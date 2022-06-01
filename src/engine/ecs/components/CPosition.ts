import { IComponent } from '../IComponent';
import { Vect2D } from '../../utils/Vect2D';

export class CPosition implements IComponent {
  public static id: string = "Position";
  public id: string = CPosition.id;

  private _value: Vect2D;
  public get value(): Vect2D {
      return this._value;
  }
  public set value(value: Vect2D) {
      this._value = value;
  }

  private _temporaryValue: Vect2D;
    public get temporaryValue(): Vect2D {
        return this._temporaryValue;
    }
    public set temporaryValue(value: Vect2D) {
        this._temporaryValue = value;
    }

  constructor(pos: Vect2D) {
    this._value = pos;
    this._temporaryValue = pos;
  }
}