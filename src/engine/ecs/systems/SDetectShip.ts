import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { CShipSensor } from '../components/CShipSensor';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';
import { IEntity } from '../IEntity';
import { ShipRole, Team } from '../../GameEngine';
import { Vect2D } from '../../utils/Vect2D';
import { CIgnore } from '../components/CIgnore';

export class SDetectShip implements ISystem {
  public id = 'DetectShip';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const shipEntities = ecs.selectEntitiesFromComponents([CShip.id, CShipSensor.id, CPosition.id, CDomain.id], [CIgnore.id]);
    const targetShips = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id], [CIgnore.id]);

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

      if (shipsTeam.length === 0) {
        break;
      }

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
        let mainTargetGroupsByPriority: IEntity[][] = [];
        let secondaryTargetGroupsByPriority: IEntity[][] = [];
        if (ship.role === ShipRole.Hunting) {
          mainTargetGroupsByPriority = [ennemyMiners, ennemyHunters, ennemyBlockers];
        }
        else if (ship.role === ShipRole.Blocking) {
          mainTargetGroupsByPriority = [friendlyMiners, friendlyHunters, friendlyBlockers];
          secondaryTargetGroupsByPriority = [ennemyHunters];
        }

        let sensor = shipEntity.components.get(CShipSensor.id) as CShipSensor;
        let sensorInfo = this.getSensorInformationOnGroup(entityPos, mainTargetGroupsByPriority);
        sensor.mainDetectedPos = sensorInfo.position;
        sensor.mainDetectedShipId = sensorInfo.id;

        if (secondaryTargetGroupsByPriority.length > 0) {
          sensorInfo = this.getSensorInformationOnGroup(entityPos, secondaryTargetGroupsByPriority);
          sensor.secondaryDetectedPos = sensorInfo.position;
          sensor.secondaryDetectedShipId = sensorInfo.id;
        }

        shipEntity.components.set(CShipSensor.id, sensor);
      }
    }
  }

  private getSensorInformationOnGroup(position: CPosition, groupsEntity: IEntity[][]): {position: Vect2D | undefined, id: string} {
    let closest = undefined;
    let index = 0;
    while (closest === undefined && index < groupsEntity.length) {
      closest = this.getClosestInGroupFromPosition(position, groupsEntity[index]);
      index++;
    }

    let closestPos: Vect2D | undefined = undefined;
    let closestId: string = "";

    if (closest !== undefined) {
      const targetPos = closest.components.get(CPosition.id) as CPosition;
      closestPos = targetPos.value;
      closestId = closest.name;
    }

    return {
      position: closestPos,
      id: closestId
    };
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