import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CAsteroid } from '../components/CAsteroid';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';
import { CAsteroidSensor } from '../components/CAsteroidSensor';

export class SDetectAsteroid implements ISystem {
  public id = 'DetectAsteroid';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CAsteroidSensor.id, CPosition.id, CDomain.id]);
    const asteroids = ecs.selectEntitiesFromComponents([CAsteroid.id, CPosition.id]);

    for (let ship of entities) {
      const shipPos =  ship.components.get(CPosition.id) as CPosition;
      let minDistance = Infinity;
      let targetPos = undefined;
      let targetName = "";

      for (let asteroid of asteroids) {
          const asteroidPos =  asteroid.components.get(CPosition.id) as CPosition;
          const distance = asteroidPos.value.distance2(shipPos.value);
          if (distance < minDistance) {
              targetPos = asteroidPos.value;
              targetName = asteroid.name;
          }
      }

      let sensor = ship.components.get(CAsteroidSensor.id) as CAsteroidSensor;
      if (asteroids.length > 0) {
        sensor.detectedPos = targetPos;
        sensor.detectedAsteroidId = targetName;
      }
      else {
        sensor.detectedPos = undefined;
        sensor.detectedAsteroidId = "";
      }
      ship.components.set(CAsteroidSensor.id, sensor);
    }
  }
}