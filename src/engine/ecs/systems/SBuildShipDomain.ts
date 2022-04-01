import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { CShipSensor } from '../components/CShipSensor';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';

export class SBuildShipDomain implements ISystem {
  public id = 'BuildShipDomain';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CDomain.id, CPosition.id]);

    for (let entity of entities) {
        let cDomain =  entity.components.get(CDomain.id) as CDomain<{isMoving: 0, isInRange: 1}>;
        let targetPos = entity.components.get(CShipSensor.id) as CShipSensor;

        if (targetPos !== undefined && targetPos.detectedPos !== undefined) {
            let pos = entity.components.get(CPosition.id) as CPosition;
            let isInRange = targetPos.detectedPos.distance2(pos.value) < 10000 ? 1 : 0;
            cDomain.domain.updateWorldState(cDomain.domain.indexes.isInRange, isInRange);
        }
        else {
            cDomain.domain.updateWorldState(cDomain.domain.indexes.isInRange, 0);
        }
        entity.components.set(CDomain.id, cDomain);
    }
  }
}