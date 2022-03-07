import { IComponent } from '../IComponent';

export class CSpeed implements IComponent {
  public static id: string = "Speed";
  public id: string = CSpeed.id;

  private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }

  constructor(v: number) {
    this._value = v;
  }
}