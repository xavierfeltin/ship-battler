import { GridWithWeights } from '../../utils/GridWithWeigth';
import { IComponent } from '../IComponent';

export interface IMapAttributes {
    width: number;
    height: number;
    granularity: number;
}

export class CMap implements IComponent {
  public static id: string = "Map";
  public id: string = CMap.id;

  private _attr: IMapAttributes;
    public get attr(): IMapAttributes {
        return this._attr;
    }
    public set attr(value: IMapAttributes) {
        this._attr = value;
    }

  private _grid: GridWithWeights;
    public get grid(): GridWithWeights {
        return this._grid;
    }
    public set grid(value: GridWithWeights) {
        this._grid = value;
    }

  public constructor(attributes: IMapAttributes, weights?: Map<string, number>) {
    this._attr = attributes;
    this._grid = new GridWithWeights(this._attr.width, this._attr.height, this._attr.granularity, weights);
  }
}