import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { CTimeFrame } from '../components/CTimeFrame';
import { CSpeed } from '../components/CSpeed';
import { COrientation } from '../components/COrientation';
import { Vect2D } from '../../utils/Vect2D';

export class SMove implements ISystem {
  public id = 'Move';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CPosition.id, COrientation.id, CSpeed.id, CVelocity.id]);
    const timeFrame = ecs.selectEntityFromId('TimeFrame')?.components.get(CTimeFrame.id) as CTimeFrame;
    const time = timeFrame.time;

    for (let entity of entities) {
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
  }
}