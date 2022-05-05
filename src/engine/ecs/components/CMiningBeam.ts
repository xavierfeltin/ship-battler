import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CMiningBeam implements IComponent {
  public static id: string = 'MiningBeam';
  public id: string = CMiningBeam.id;

  private _target: Vect2D;
  public get target(): Vect2D {
    return this._target;
  }
  public set target(value: Vect2D) {
    this._target = value;
  }

  private _heading: Vect2D;
  public get heading(): Vect2D {
    return this._heading;
  }
  public set heading(value: Vect2D) {
    this._heading = value;
  }

  public constructor(target: Vect2D, heading: Vect2D) {
    this._target = target;
    this._heading = heading;
  }
}