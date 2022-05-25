import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';
import { CPartialActionWithCooldown } from './CPartialActionWithCooldown';

export class CShipSensor extends CPartialActionWithCooldown implements IComponent {
  public static id: string = 'ShipSensor';
  public id: string = CShipSensor.id;

  private _mainDetectedShipId: string;
    public get mainDetectedShipId(): string {
        return this._mainDetectedShipId;
    }
    public set mainDetectedShipId(value: string) {
        this._mainDetectedShipId = value;
    }

  private _mainDetectedShipPos: Vect2D | undefined; // in degrees
    public get mainDetectedPos(): Vect2D | undefined {
        return this._mainDetectedShipPos;
    }
    public set mainDetectedPos(pos: Vect2D | undefined) {
        this._mainDetectedShipPos = pos;
    }

  private _secondaryDetectedShipId: string;
    public get secondaryDetectedShipId(): string {
        return this._secondaryDetectedShipId;
    }
    public set secondaryDetectedShipId(value: string) {
        this._secondaryDetectedShipId = value;
    }

  private _secondaryDetectedShipPos: Vect2D | undefined; // in degrees
    public get secondaryDetectedPos(): Vect2D | undefined {
        return this._secondaryDetectedShipPos;
    }
    public set secondaryDetectedPos(pos: Vect2D | undefined) {
        this._secondaryDetectedShipPos = pos;
    }

  constructor(reloadTime: number) {
    super(reloadTime);

    this._mainDetectedShipId = "";
    this._mainDetectedShipPos = undefined;

    this._secondaryDetectedShipId = "";
    this._secondaryDetectedShipPos = undefined;
  }
}