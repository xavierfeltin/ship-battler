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
import { IFieldOfView, MyMath } from '../../utils/MyMath';
import { COrientation } from '../components/COrientation';
import { CFieldOfView } from '../components/CFieldOfView';

export class SDetectShip implements ISystem {
  public id = 'DetectShip';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const shipEntities = ecs.selectEntitiesFromComponents([CShip.id, CShipSensor.id, CPosition.id, COrientation.id, CDomain.id], [CIgnore.id]);
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
        continue;
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
        const entityOrientation = shipEntity.components.get(COrientation.id) as COrientation;
        const entityFOV = shipEntity.components.get(CFieldOfView.id) as CFieldOfView;
        const ship = shipEntity.components.get(CShip.id) as CShip;
        let sensor = shipEntity.components.get(CShipSensor.id) as CShipSensor;

        if (sensor.isOperational()) {
          sensor.resetSensorInformation();
          sensor.activate();
        }
        else {
          continue;
        }

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

        let sensorInfo = this.getSensorInformationOnGroup(entityPos, entityOrientation, entityFOV, mainTargetGroupsByPriority);
        sensor.mainDetectedPos = sensorInfo.position;
        sensor.mainDetectedShipId = sensorInfo.id;

        if (secondaryTargetGroupsByPriority.length > 0) {
          sensorInfo = this.getSensorInformationOnGroup(entityPos, entityOrientation, entityFOV, secondaryTargetGroupsByPriority);
          sensor.secondaryDetectedPos = sensorInfo.position;
          sensor.secondaryDetectedShipId = sensorInfo.id;
        }

        shipEntity.components.set(CShipSensor.id, sensor);
      }
    }
  }

  private getSensorInformationOnGroup(position: CPosition, orientation: COrientation, entityFOV: CFieldOfView, groupsEntity: IEntity[][]): {position: Vect2D | undefined, id: string} {
    let closest: IEntity | undefined = undefined;
    let index = 0;
    while (closest === undefined && index < groupsEntity.length) {
      closest = this.getClosestInGroupFromPosition(position, orientation, entityFOV, groupsEntity[index]);
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

  private getClosestInGroupFromPosition(position: CPosition, orientation: COrientation, entityFOV: CFieldOfView, groupEntity: IEntity[]): IEntity | undefined {
    if (groupEntity.length === 0) {
      return undefined;
    }

    let closest: IEntity | undefined = undefined;
    let minDistance = Infinity;
    for (let entity of groupEntity) {

      const pos =  entity.components.get(CPosition.id) as CPosition;
      const fovInformation: IFieldOfView = {
        origin: position.value,
        orientation: orientation.angle,
        heading: orientation.heading,
        angle: entityFOV.angle, // In Degree
        fovDepth: entityFOV.depth
      }

      if (MyMath.isInFieldOfView(fovInformation, pos.value)) {
        const distance = pos.value.distance2(position.value);
        if (distance < minDistance) {
          closest = entity;
          minDistance = distance;
        }
      }
    }
    return closest;
  }
}