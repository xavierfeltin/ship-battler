import { IComponent } from '../IComponent';

export class CTimeFrame implements IComponent {
  public static id: string = 'TimeFrame';
  public id: string = CTimeFrame.id;

  private _frame: number;
  public get frame(): number {
    return this._frame;
  }
  public set frame(value: number) {
    this._frame = value;
  }

  private _time: number;
    public get time(): number {
        return this._time;
    }
    public set time(value: number) {
        this._time = value;
    }

  public constructor() {
      this._time = 1;
      this._frame = 1;
  }
}