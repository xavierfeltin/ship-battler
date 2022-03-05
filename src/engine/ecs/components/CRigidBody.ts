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

  public constructor(radius: number) {
      this._radius = radius;
  }
}