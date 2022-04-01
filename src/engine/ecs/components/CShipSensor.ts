import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CShipSensor implements IComponent {
  public static id: string = 'ShipSensor';
  public id: string = CShipSensor.id;

  private _detectedShipId: string;
    public get detectedShipId(): string {
        return this._detectedShipId;
    }
    public set detectedShipId(value: string) {
        this._detectedShipId = value;
    }

  private _detectedShipPos: Vect2D | undefined; // in degrees
    public get detectedPos(): Vect2D | undefined {
        return this._detectedShipPos;
    }
    public set detectedPos(pos: Vect2D | undefined) {
        this._detectedShipPos = pos;
    }

  constructor() {
    this._detectedShipId = "";
    this._detectedShipPos = undefined;
  }
}