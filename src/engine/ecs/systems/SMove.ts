import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { CTimeFrame } from '../components/CTimeFrame';

export class SMove implements ISystem {
  name = 'Move';
  priority = 0;

  onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CPosition.id, CVelocity.id]);
    const timeFrame = ecs.selectEntityFromId('TimeFrame')?.components.get(CTimeFrame.id) as CTimeFrame;
    const time = timeFrame.time;

    for (let entity of entities) {
        const pos = entity.components.get(CPosition.id) as CPosition;
        const vel = entity.components.get(CVelocity.id) as CVelocity;

        pos.value.x = pos.value.x + vel.value.x * time;
        pos.value.y = pos.value.y + vel.value.y * time;

        ecs.addOrUpdateComponentOnEntity(entity, pos);
    }
  }
}