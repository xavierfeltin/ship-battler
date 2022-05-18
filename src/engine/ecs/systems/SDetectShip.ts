import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { CShipSensor } from '../components/CShipSensor';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';
import { IEntity } from '../IEntity';
import { ShipRole, Team } from '../../GameEngine';

export class SDetectShip implements ISystem {
  public id = 'DetectShip';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const shipEntities = ecs.selectEntitiesFromComponents([CShip.id, CShipSensor.id, CPosition.id, CDomain.id]);
    const targetShips = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id]);

    // No ship is able to attack
    if (shipEntities.length === 0) {
      return;
    }

    const teams = Object.values(Team).filter((value: Team | string) => typeof value !== "string");
    for (let team of teams) {
      const shipsTeam = shipEntities.filter((shipEntity: IEntity) => {
        const ship = shipEntity.components.get(CShip.id) as CShip;
        return ship.team === team;
      });

      const firstShip = shipsTeam[0].components.get(CShip.id) as CShip;
      const currentTeam = firstShip.team;

      const ennemyMiners = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Mining && ship.team !== currentTeam;
      });

      const ennemyBlockers = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Blocking && ship.team !== currentTeam;
      });

      const ennemyHunters = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Hunting && ship.team !== currentTeam;
      });

      const friendlyMiners = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Mining && ship.team === currentTeam;
      });

      const friendlyBlockers = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Blocking && ship.team === currentTeam;
      });

      const friendlyHunters = targetShips.filter((targetShipEntity: IEntity) => {
        const ship = targetShipEntity.components.get(CShip.id) as CShip;
        return ship.role === ShipRole.Hunting && ship.team === currentTeam;
      });

      for (let shipEntity of shipsTeam) {
        const entityPos =  shipEntity.components.get(CPosition.id) as CPosition;
        const ship = shipEntity.components.get(CShip.id) as CShip;

        // Target priority : miners, hunters then blockers
        let targetGroupsByPriority: IEntity[][] = [];
        if (ship.role === ShipRole.Hunting) {
          targetGroupsByPriority = [ennemyMiners, ennemyHunters, ennemyBlockers];
        }
        else if (ship.role === ShipRole.Blocking) {
          targetGroupsByPriority = [friendlyMiners, friendlyHunters, friendlyBlockers];
        }

        let closest = undefined;
        let index = 0;
        while (closest === undefined && index < targetGroupsByPriority.length) {
          closest = this.getClosestInGroupFromPosition(entityPos, targetGroupsByPriority[index]);
          index++;
        }

        let sensor = shipEntity.components.get(CShipSensor.id) as CShipSensor;
        if (closest !== undefined) {
          const targetPos = closest.components.get(CPosition.id) as CPosition;
          sensor.detectedPos = targetPos.value;
          sensor.detectedShipId = closest.name;
        }
        else {
          sensor.detectedPos = undefined;
          sensor.detectedShipId = "";
        }
        shipEntity.components.set(CShipSensor.id, sensor);
      }
    }
  }

  private getClosestInGroupFromPosition(position: CPosition, groupEntity: IEntity[]): IEntity | undefined {
    if (groupEntity.length === 0) {
      return undefined;
    }

    let closest = groupEntity[0];
    let minDistance = Infinity;
    for (let entity of groupEntity) {
      const pos =  entity.components.get(CPosition.id) as CPosition;
      const distance = pos.value.distance2(position.value);
      if (distance < minDistance) {
        closest = entity;
        minDistance = distance;
      }
    }
    return closest;
  }
}