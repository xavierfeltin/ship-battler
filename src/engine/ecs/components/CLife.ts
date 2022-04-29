import { IComponent } from '../IComponent';

export class CLife implements IComponent {
  public static id: string = "Life";
  public id: string = CLife.id;

  private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }

  constructor(points: number) {
    this._value = points;
  }
}