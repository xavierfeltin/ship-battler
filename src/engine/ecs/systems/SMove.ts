import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { CTimeFrame } from '../components/CTimeFrame';
import { CSpeed } from '../components/CSpeed';
import { COrientation } from '../components/COrientation';
import { Vect2D } from '../../utils/Vect2D';
import { CShip } from '../components/CShip';
import { IEntity } from '../IEntity';
import { CMissile } from '../components/CMissile';
import { CLife } from '../components/CLife';

export class SMove implements ISystem {
  public id = 'Move';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const timeFrame = ecs.selectEntityFromId('TimeFrame')?.components.get(CTimeFrame.id) as CTimeFrame;
    const time = timeFrame.time;

    const ships = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id, COrientation.id, CSpeed.id, CVelocity.id]);
    for (let ship of ships) {
      this.move(ship, time, ecs);
    }

    const missiles = ecs.selectEntitiesFromComponents([CMissile.id, CPosition.id, COrientation.id, CSpeed.id, CVelocity.id, CLife.id]);
    for (let missile of missiles) {
      this.move(missile, time, ecs);
      this.updateTTL(missile, ecs);
    }
  }

  private move(entity: IEntity, time: number, ecs: ECSManager): void {
    const pos = entity.components.get(CPosition.id) as CPosition;
    const orientation = entity.components.get(COrientation.id) as COrientation;
    const speed = entity.components.get(CSpeed.id) as CSpeed;
    const velocity = entity.components.get(CVelocity.id) as CVelocity;
    velocity.value = new Vect2D(orientation.heading.x * speed.value, orientation.heading.y * speed.value);

    pos.value.x = pos.value.x + velocity.value.x * time;
    pos.value.y = pos.value.y + velocity.value.y * time;

    ecs.addOrUpdateComponentOnEntity(entity, pos);
    ecs.addOrUpdateComponentOnEntity(entity, velocity);
  }

  private updateTTL(missile: IEntity, ecs: ECSManager): void {
    let life: CLife = missile.components.get(CLife.id) as CLife;
    if (life !== undefined) {
      life.value = life.value - 1;
      ecs.addOrUpdateComponentOnEntity(missile, life);
    }
  }
}