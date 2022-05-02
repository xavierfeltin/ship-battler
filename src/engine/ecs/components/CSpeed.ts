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

  private _maxValue: number;
  public get maxValue(): number {
    return this._maxValue;
  }
  public set maxValue(value: number) {
    this._maxValue = value;
  }

  constructor(v: number) {
    this._value = v;
    this._maxValue = v;
  }

  public stop() {
    this.value = 0;
  }

  public go() {
    this.value = this.maxValue;
  }
}