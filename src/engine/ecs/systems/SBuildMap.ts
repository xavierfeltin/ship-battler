import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CMap } from '../components/CMap';
import { CShip } from '../components/CShip';
import { CRenderer } from '../components/CRenderer';
import { IEntity } from '../IEntity';
import { CPosition } from '../components/CPosition';
import { GameEnityUniqId } from '../../GameEngine';
import { CAsteroid } from '../components/CAsteroid';
import { Vect2D } from '../../utils/Vect2D';
import { CRigidBody } from '../components/CRigidBody';

export class SBuildMap implements ISystem {
  public id = 'BuildMap';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const ships = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id]);
    const asteroids = ecs.selectEntitiesFromComponents([CAsteroid.id, CPosition.id]);
    const area = ecs.selectEntityFromId(GameEnityUniqId.Area)?.components.get(CRenderer.id) as CRenderer;

    const width = area.attr.width || 0;
    const height = area.attr.height || 0;
    const granularity = 20; // same as rigid body of a ship

    for (let entity of ships) {
        let map = this.buildMap(entity, ships, asteroids, width, height, granularity);
        ecs.addOrUpdateComponentOnEntity(entity, map);
    }
  }

  private buildMap(entity: IEntity, ships: IEntity[], asteroids: IEntity[], width: number, height: number, granularity: number): CMap {

    let map = new CMap({
      width: width,
      height: height,
      granularity: granularity
    });

    let weights = new Map<string, number>();
    let radiusPoints: Vect2D[] = [
      new Vect2D(0,0),
      new Vect2D(-1,0),
      new Vect2D(1,0),
      new Vect2D(0,-1),
      new Vect2D(0,1),
      new Vect2D(-1,-1),
      new Vect2D(-1,1),
      new Vect2D(1,-1),
      new Vect2D(1,1)
    ];

    for (let ship of ships) {
      if (ship.name !== entity.name) {
        const shipPos = ship.components.get(CPosition.id) as CPosition;
        const rb = ship.components.get(CRigidBody.id) as CRigidBody;
        const radius = rb !== undefined ? rb.radius : 0;

        for (let point of radiusPoints) {
          const pos = new Vect2D(shipPos.value.x + point.x * radius, shipPos.value.y + point.y * radius);
          const node = map.grid.getClosestNodeFromPosition(pos);
          weights.set(node.key(), 1000);
        }
      }
    }

    for (let asteroid of asteroids) {
      const asteroidPos = asteroid.components.get(CPosition.id) as CPosition;
      const rb = asteroid.components.get(CRigidBody.id) as CRigidBody;
      const radius = rb !== undefined ? rb.radius : 0;

      for (let point of radiusPoints) {
        const pos = new Vect2D(asteroidPos.value.x + point.x * radius, asteroidPos.value.y + point.y * radius);
        const node = map.grid.getClosestNodeFromPosition(pos);
        weights.set(node.key(), 1000);
      }
    }

    map.grid.setConstraints(weights);

    return map;
  }
}