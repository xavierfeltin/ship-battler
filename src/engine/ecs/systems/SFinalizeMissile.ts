import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { IEntity } from '../IEntity';
import { CMissile } from '../components/CMissile';
import { CLife } from '../components/CLife';

export class SFinalizeMissile implements ISystem {
  public id = 'FinalizeMissile';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CMissile.id]);
    for (let missile of entities) {
        this.consumeFuel(missile, ecs);
    }
  }

  private consumeFuel(missile: IEntity, ecs: ECSManager): void {
    const life = missile.components.get(CLife.id) as CLife;
    if (life !== undefined && life.value === 0) {
        ecs.removeEntity(missile.name);
    }
  }
}