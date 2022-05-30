import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CNavigation implements IComponent {
  public static id: string = 'Navigation';
  public id: string = CNavigation.id;

  private _path: Vect2D[];
    public get path(): Vect2D[] {
        return this._path;
    }
    public set path(value: Vect2D[]) {
        this._path = value;
    }

  private _destination: Vect2D;
  public get destination(): Vect2D {
    return this._destination;
  }
  public set destination(value: Vect2D) {
    this._destination = value;
  }

  private _currentWayPoint: Vect2D | undefined;
  public get currentWayPoint(): Vect2D | undefined {
    return this._currentWayPoint;
  }
  public set currentWayPoint(value: Vect2D | undefined) {
    this._currentWayPoint = value;
  }

  private _stopAtDistance: number;
  public get stopAtDistance(): number {
    return this._stopAtDistance;
  }
  public set stopAtDistance(value: number) {
    this._stopAtDistance = value;
  }

  private hasDestinationBeenReached: boolean;

  public constructor(destination: Vect2D, stopAtDistance: number) {
    this._destination = destination;
    this._stopAtDistance = stopAtDistance;
    this._path = [];
    this._currentWayPoint = undefined;
    this.hasDestinationBeenReached = false;
  }

  public attachPath(path: Vect2D[]) {
    this._path = path;
  }

  public goToNextWayPoint() {
    this._currentWayPoint = this._path.pop();
    if (this._currentWayPoint === undefined) {
      this.hasDestinationBeenReached = true;
    }
  }

  public isNewNavigation(): boolean {
    return this._currentWayPoint === undefined && !this.hasDestinationBeenReached;
  }

  public isNavigationOver(): boolean {
    return this.hasDestinationBeenReached;
  }

  public forceEndOfNavigation() : void {
    this.hasDestinationBeenReached = true;
    this.path = [];
    this._currentWayPoint = undefined;
  }
}