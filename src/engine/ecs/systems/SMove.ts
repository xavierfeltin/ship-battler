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
import { GameEnityUniqId } from '../../GameEngine';
import { CIgnore } from '../components/CIgnore';
import { CBouncing } from '../components/CBouncing';

export class SMove implements ISystem {
  public id = 'Move';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const timeFrame = ecs.selectEntityFromId(GameEnityUniqId.TimeFrame)?.components.get(CTimeFrame.id) as CTimeFrame;
    const time = timeFrame.time;

    const ships = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id, COrientation.id, CSpeed.id, CVelocity.id], [CIgnore.id]);
    for (let ship of ships) {
      this.move(ship, time, ecs);
    }

    const missiles = ecs.selectEntitiesFromComponents([CMissile.id, CPosition.id, COrientation.id, CSpeed.id, CVelocity.id, CLife.id], [CIgnore.id]);
    for (let missile of missiles) {
        this.move(missile, time, ecs);
        this.updateTTL(missile, ecs);
    }
  }

  private move(entity: IEntity, time: number, ecs: ECSManager): void {
    const life: CLife = entity.components.get(CLife.id) as CLife;
    if (life.value === 0) {
      // Dead missiles do not move
      return;
    }

    const pos = entity.components.get(CPosition.id) as CPosition;
    const orientation = entity.components.get(COrientation.id) as COrientation;
    const speed = entity.components.get(CSpeed.id) as CSpeed;
    const velocity = entity.components.get(CVelocity.id) as CVelocity;
    const bouncing: CBouncing = entity.components.get(CBouncing.id) as CBouncing;

    let posX = pos.value.x;
    let posY = pos.value.y;
    if (bouncing !== undefined) {
      posX = posX + bouncing.velocity.x * time;
      posY = posY + bouncing.velocity.y * time;
    }
    else {
      velocity.value = new Vect2D(orientation.heading.x * speed.value, orientation.heading.y * speed.value);
      posX = posX + velocity.value.x * time;
      posY = posY + velocity.value.y * time;
    }

    if (time === 1.0) {
      pos.value.x = posX;
      pos.value.y = posY;
    }
    pos.temporaryValue.x = posX;
    pos.temporaryValue.y = posY;

    ecs.addOrUpdateComponentOnEntity(entity, pos);
    ecs.addOrUpdateComponentOnEntity(entity, velocity);
  }

  private updateTTL(missile: IEntity, ecs: ECSManager): void {
    let life: CLife = missile.components.get(CLife.id) as CLife;
    if (life !== undefined) {
      life.value = life.value - 1;
      ecs.addOrUpdateComponentOnEntity(missile, life);

      if (life.value === 0) {
        const deadComponent = new CIgnore();
        ecs.addOrUpdateComponentOnEntity(missile, deadComponent);
      }
    }
  }
}