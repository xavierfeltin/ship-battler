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
    const targetShips = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id]);

    for (let ship of entities) {
        const entityPos =  ship.components.get(CPosition.id) as CPosition;
        let minDistance = Infinity;
        let targetPos = undefined;
        let targetName = "";

        for (let targetShip of targetShips) {
            if (targetShip.name !== ship.name) {
                const targetShipPos =  targetShip.components.get(CPosition.id) as CPosition;
                const distance = targetShipPos.value.distance2(entityPos.value);
                if (distance < minDistance) {
                    targetPos = targetShipPos.value;
                    targetName = targetShip.name;
                }
            }
        }

        let sensor = ship.components.get(CShipSensor.id) as CShipSensor;
        if (targetPos !== undefined) {
          sensor.detectedPos = targetPos;
          sensor.detectedShipId = targetName;
        }
        else {
          sensor.detectedPos = undefined;
          sensor.detectedShipId = "";
        }
        ship.components.set(CShipSensor.id, sensor);
    }
  }
}