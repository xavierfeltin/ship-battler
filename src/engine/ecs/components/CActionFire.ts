import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CActionFire implements IComponent {
  public static id: string = "ActionFire";
  public id: string = CActionFire.id;

  private _originId: string;
  public get originId(): string {
    return this._originId;
  }
  public set originId(value: string) {
    this._originId = value;
  }

  private _originPos: Vect2D;
    public get originPos(): Vect2D {
        return this._originPos;
    }
    public set originPos(value: Vect2D) {
        this._originPos = value;
    }

    private _angle: number;
  public get angle(): number {
    return this._angle;
  }
  public set angle(value: number) {
    this._angle = value;
  }

  constructor(originId: string, originPos: Vect2D, angle: number) {
    this._originId = originId;
    this._originPos = originPos;
    this._angle = angle;
  }
}