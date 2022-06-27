import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CAsteroid } from '../components/CAsteroid';
import { CPosition } from '../components/CPosition';
import { CDomain } from '../components/CDomain';
import { CAsteroidSensor } from '../components/CAsteroidSensor';
import { IFieldOfView, MyMath } from '../../utils/MyMath';
import { Vect2D } from '../../utils/Vect2D';
import { COrientation } from '../components/COrientation';
import { CFieldOfView } from '../components/CFieldOfView';

export class SDetectAsteroid implements ISystem {
  public id = 'DetectAsteroid';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CAsteroidSensor.id, CPosition.id, COrientation.id, CDomain.id]);
    const asteroids = ecs.selectEntitiesFromComponents([CAsteroid.id, CPosition.id]);

    for (let ship of entities) {
      const shipPos =  ship.components.get(CPosition.id) as CPosition;
      const shipOrientation =  ship.components.get(COrientation.id) as COrientation;
      const shipFOV = ship.components.get(CFieldOfView.id) as CFieldOfView;
      let minDistance = Infinity;
      let targetPos: Vect2D | undefined = undefined;
      let targetName = "";

      for (let asteroid of asteroids) {
        const asteroidPos =  asteroid.components.get(CPosition.id) as CPosition;
        const fovInformation: IFieldOfView = {
          origin: shipPos.value,
          orientation: shipOrientation.angle,
          heading: shipOrientation.heading,
          angle: shipFOV.angle, // In Degree
          fovDepth: shipFOV.depth
        };

        if (MyMath.isInFieldOfView(fovInformation, asteroidPos.value)) {
          const distance = asteroidPos.value.distance2(shipPos.value);
          if (distance < minDistance) {
            targetPos = asteroidPos.value;
            targetName = asteroid.name;
            minDistance = distance;
          }
        }
      }

      let sensor = ship.components.get(CAsteroidSensor.id) as CAsteroidSensor;
      sensor.detectedPos = targetPos;
      sensor.detectedAsteroidId = targetName;
      ship.components.set(CAsteroidSensor.id, sensor);
    }
  }
}