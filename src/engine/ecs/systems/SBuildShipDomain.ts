import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { CShipSensor } from '../components/CShipSensor';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';
import { IEntity } from '../IEntity';
import { CAsteroidSensor } from '../components/CAsteroidSensor';
import { CActionMine } from '../components/CActionMine';
import { CCannon } from '../components/CCannon';

export class SBuildShipDomain implements ISystem {
  public id = 'BuildShipDomain';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CDomain.id, CPosition.id]);
    for (let ship of entities) {
        let cDomain =  ship.components.get(CDomain.id) as CDomain<{isMoving: 0, isInRange: 1, hasEnnemyToAttack: 2, hasAsteroidToMine: 3, isMining: 4, isReadyToFire: 5}>;
        this.updateAttackInformation(ship, cDomain);
        this.updateMiningInformation(ship, cDomain);

        ship.components.set(CDomain.id, cDomain);
    }
  }

  private updateAttackInformation(ship: IEntity, domain: CDomain<{isMoving: 0, isInRange: 1, hasEnnemyToAttack: 2, isReadyToFire: 5}>): void {
    let targetPos = ship.components.get(CShipSensor.id) as CShipSensor;
    if (targetPos !== undefined && targetPos.detectedPos !== undefined) {
        let pos = ship.components.get(CPosition.id) as CPosition;
        let isInRange = targetPos.detectedPos.distance2(pos.value) < 20000 ? 1 : 0;
        domain.domain.updateWorldState(domain.domain.indexes.isInRange, isInRange);
        domain.domain.updateWorldState(domain.domain.indexes.hasEnnemyToAttack, 1);
    }
    else {
        domain.domain.updateWorldState(domain.domain.indexes.isInRange, 0);
        domain.domain.updateWorldState(domain.domain.indexes.hasEnnemyToAttack, 0);
    }

    const cannon = ship.components.get(CCannon.id) as CCannon;
    if (cannon !== undefined) {
      const isCannonCanFire: number = cannon.isOperational() ? 1 : 0;
      domain.domain.updateWorldState(domain.domain.indexes.isReadyToFire, isCannonCanFire);
    }
  }

  private updateMiningInformation(ship: IEntity, domain: CDomain<{isMoving: 0, isInRange: 1, hasAsteroidToMine: 3, isMining: 4}>): void {
    let mining = ship.components.get(CActionMine.id) as CActionMine;
    if (mining !== undefined) {
      domain.domain.updateWorldState(domain.domain.indexes.isInRange, 1);
      domain.domain.updateWorldState(domain.domain.indexes.isMining, 1);
      domain.domain.updateWorldState(domain.domain.indexes.hasAsteroidToMine, 1);
    }
    else
    {
      let asteroidPos = ship.components.get(CAsteroidSensor.id) as CAsteroidSensor;
      if (asteroidPos !== undefined && asteroidPos.detectedPos !== undefined) {
        let pos = ship.components.get(CPosition.id) as CPosition;
        let isInRange = asteroidPos.detectedPos.distance2(pos.value) < 20000 ? 1 : 0;
        domain.domain.updateWorldState(domain.domain.indexes.isInRange, isInRange);
        domain.domain.updateWorldState(domain.domain.indexes.hasAsteroidToMine, 1);
      }
      else {
        domain.domain.updateWorldState(domain.domain.indexes.isInRange, 0);
        domain.domain.updateWorldState(domain.domain.indexes.hasAsteroidToMine, 0);
      }
      domain.domain.updateWorldState(domain.domain.indexes.isMining, 0);
    }
  }
}