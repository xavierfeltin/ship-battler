import { IComponent } from '../IComponent';

export class CTimeFrame implements IComponent {
  name = 'TimeFrame';

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