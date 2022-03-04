import { IComponent } from '../IComponent';

export interface IRenderAttributes {
    color?: string;
    width?: number;
    height?: number;
    sprite?: string;
    ctx: CanvasRenderingContext2D
}

export class CRenderer implements IComponent {
  name = "Renderer";

  private _attr: IRenderAttributes;
    public get attr(): IRenderAttributes {
        return this._attr;
    }
    public set attr(value: IRenderAttributes) {
        this._attr = value;
    }

  public constructor(attributes: IRenderAttributes) {
    this._attr = attributes;
  }
}