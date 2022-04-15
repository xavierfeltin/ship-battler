import { IComponent } from '../IComponent';

export class CCanvas implements IComponent {
  public static id: string = "Canvas";
  public id: string = CCanvas.id;

  private _ctx: CanvasRenderingContext2D
    public get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }
    public set ctx(ctx: CanvasRenderingContext2D) {
        this._ctx = ctx;
    }

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
}