import { IComponent } from '../IComponent';

export class CShip implements IComponent {
  public static id: string = 'Ship';
  public id: string = CShip.id;

  private _miningDistance: number;
  public get miningDistance(): number {
    return this._miningDistance;
  }
  public set miningDistance(value: number) {
    this._miningDistance = value;
  }

  private _shootingDistance: number;
  public get shootingDistance(): number {
    return this._shootingDistance;
  }
  public set shootingDistance(value: number) {
    this._shootingDistance = value;
  }

  public constructor(miningDistance: number, shootingDistance: number) {
    this._miningDistance = miningDistance;
    this._shootingDistance = shootingDistance;
  }
}