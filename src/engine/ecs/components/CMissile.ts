import { IComponent } from '../IComponent';

export class CMissile implements IComponent {
  public static id: string = 'Missile';
  public id: string = CMissile.id;

  private _shipId: string;
  public get shipId(): string {
    return this._shipId;
  }
  public set shipId(value: string) {
    this._shipId = value;
  }

  private _damage: number;
  public get damage(): number {
    return this._damage;
  }
  public set damage(value: number) {
    this._damage = value;
  }

  public constructor(ship: string) {
    this._shipId = ship;
    this._damage = 10;
  }
}