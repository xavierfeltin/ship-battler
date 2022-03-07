import { IComponent } from '../IComponent';

export class CActionTurn implements IComponent {
  public static id: string = "ActionTurn";
  public id: string = CActionTurn.id;

  private _angle: number;
    public get angle(): number {
        return this._angle;
    }
    public set angle(angle: number) {
        this._angle = angle;
    }

  constructor(angle: number) {
    this._angle = angle;
  }
}