import { Collision } from '../../utils/UCollision';
import { IComponent } from '../IComponent';

export class CCollisions implements IComponent {
  public static id: string = 'Collisions';
  public id: string = CCollisions.id;

  private _collisions: Collision[];
    public get collisions(): Collision[] {
        return this._collisions;
    }
    public set collisions(value: Collision[]) {
        this._collisions = value;
    }

    public constructor() {
        this._collisions = [];
    }

    public push(collision: Collision): void {
        this.collisions.push(collision);
    }

    public reset(): void {
        this.collisions = [];
    }
}