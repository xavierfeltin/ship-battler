import { IComponent } from '../IComponent';

export class CRigidBody implements IComponent {
  public static id: string = 'RigidBody';
  public id: string = CRigidBody.id;

  private _radius: number;
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
    }

  private _mass: number;
    public get mass(): number {
      return this._mass;
    }
    public set mass(value: number) {
      this._mass = value;
    }


  public constructor(radius: number, mass: number) {
      this._radius = radius;
      this._mass = mass;
  }
}