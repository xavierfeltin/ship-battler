import { IComponent } from '../IComponent';

export class CTimeFrame implements IComponent {
  public static id: string = 'TimeFrame';
  public id: string = CTimeFrame.id;

  private _time: number;
    public get time(): number {
        return this._time;
    }
    public set time(value: number) {
        this._time = value;
    }

  public constructor() {
      this._time = 1;
  }
}