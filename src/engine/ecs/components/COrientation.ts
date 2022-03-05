import { IComponent } from '../IComponent';

export class COrientation implements IComponent {
  public static id: string = "Orientation";
  public id: string = COrientation.id;

  private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }

  constructor(angle: number) {
    this._value = angle;
  }
}