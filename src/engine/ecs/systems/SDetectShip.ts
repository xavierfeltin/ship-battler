import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { CShipSensor } from '../components/CShipSensor';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';

export class SDetectShip implements ISystem {
  public id = 'DetectShip';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShipSensor.id, CPosition.id, CDomain.id]);
    const ships = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id]);

    for (let entity of entities) {
        const entityPos =  entity.components.get(CPosition.id) as CPosition;
        let minDistance = Infinity;
        let targetPos = undefined;
        let targetName = "";

        for (let ship of ships) {
            if (ship.name !== entity.name) {
                const shipPos =  ship.components.get(CPosition.id) as CPosition;
                const distance = shipPos.value.distance2(entityPos.value);
                if (distance < minDistance) {
                    targetPos = shipPos.value;
                    targetName = ship.name;
                }
            }
        }

        let sensor = entity.components.get(CShipSensor.id) as CShipSensor;
        sensor.detectedPos = targetPos;
        sensor.detectedShipId = targetName;
        entity.components.set(CShipSensor.id, sensor);
    }
  }
}