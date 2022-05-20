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
import { ShipRole } from '../../GameEngine';

export class SBuildShipDomain implements ISystem {
  public id = 'BuildShipDomain';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CDomain.id, CPosition.id]);
    for (let shipEntity of entities) {
        let ship = shipEntity.components.get(CShip.id) as CShip;
        let cDomain = shipEntity.components.get(CDomain.id) as CDomain<{
          isMoving: number,
          isInRange: number,
          hasEnnemyToAttack: number,
          hasAsteroidToMine: number,
          isMining: number,
          isReadyToFire: number,
          hasShipToProtect: number,
          hasFoundMenaceOnProtectedShip: number
        }>;

        switch(ship.role) {
          case ShipRole.Hunting:
            this.updateAttackInformation(shipEntity, cDomain);
            break;
          case ShipRole.Mining:
            this.updateMiningInformation(shipEntity, cDomain);
            break;
          case ShipRole.Blocking:
            this.updateProtectingInformation(shipEntity, cDomain);
            break;
        }
        shipEntity.components.set(CDomain.id, cDomain);
    }
  }

  private updateAttackInformation(ship: IEntity, domain: CDomain<{isMoving: number, isInRange: number, hasEnnemyToAttack: number, isReadyToFire: number}>): void {
    let targetPos = ship.components.get(CShipSensor.id) as CShipSensor;
    let shipInfo = ship.components.get(CShip.id) as CShip;
    if (targetPos !== undefined && targetPos.mainDetectedPos !== undefined) {
        let pos = ship.components.get(CPosition.id) as CPosition;
        let isInRange = targetPos.mainDetectedPos.distance2(pos.value) < (shipInfo.shootingDistance * shipInfo.shootingDistance)  ? 1 : 0;
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

  private updateMiningInformation(ship: IEntity, domain: CDomain<{isMoving: number, isInRange: number, hasAsteroidToMine: number, isMining: number}>): void {
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
        let shipInfo = ship.components.get(CShip.id) as CShip;
        let isInRange = asteroidPos.detectedPos.distance2(pos.value) < (shipInfo.miningDistance * shipInfo.miningDistance) ? 1 : 0;
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

  private updateProtectingInformation(ship: IEntity, domain: CDomain<{isMoving: number, isInRange: number, hasShipToProtect: number, hasFoundMenaceOnProtectedShip: number}>): void {
    let sensor = ship.components.get(CShipSensor.id) as CShipSensor;
    let shipInfo = ship.components.get(CShip.id) as CShip;
    if (sensor !== undefined && sensor.mainDetectedPos !== undefined) {
      let pos = ship.components.get(CPosition.id) as CPosition;
      let isInRange = sensor.mainDetectedPos.distance2(pos.value) < (shipInfo.protectingDistance * shipInfo.protectingDistance) ? 1 : 0;
      domain.domain.updateWorldState(domain.domain.indexes.isInRange, isInRange);
      domain.domain.updateWorldState(domain.domain.indexes.hasShipToProtect, 1);

      const hasFoundMenace: number = sensor.secondaryDetectedPos !== undefined ? 1 : 0;
      domain.domain.updateWorldState(domain.domain.indexes.hasFoundMenaceOnProtectedShip, hasFoundMenace);
    }
    else {
      domain.domain.updateWorldState(domain.domain.indexes.isInRange, 0);
      domain.domain.updateWorldState(domain.domain.indexes.hasShipToProtect, 0);
    }
  }
}