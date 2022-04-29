import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CAsteroidSensor implements IComponent {
  public static id: string = 'AsteroidSensor';
  public id: string = CAsteroidSensor.id;

  private _detectedAsteroidId: string;
    public get detectedAsteroidId(): string {
        return this._detectedAsteroidId;
    }
    public set detectedAsteroidId(value: string) {
        this._detectedAsteroidId = value;
    }

  private _detectedAsteroidPos: Vect2D | undefined; // in degrees
    public get detectedPos(): Vect2D | undefined {
        return this._detectedAsteroidPos;
    }
    public set detectedPos(pos: Vect2D | undefined) {
        this._detectedAsteroidPos = pos;
    }

  constructor() {
    this._detectedAsteroidId = "";
    this._detectedAsteroidPos = undefined;
  }
}