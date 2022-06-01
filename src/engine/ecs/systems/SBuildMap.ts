import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CMap } from '../components/CMap';
import { CShip } from '../components/CShip';
import { CRenderer } from '../components/CRenderer';
import { IEntity } from '../IEntity';
import { CPosition } from '../components/CPosition';
import { GameEnityUniqId } from '../../GameEngine';
import { CAsteroid } from '../components/CAsteroid';

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
    for (let ship of ships) {
      if (ship.name !== entity.name) {
        const shipPos = ship.components.get(CPosition.id) as CPosition;
        const node = map.grid.getClosestNodeFromPosition(shipPos.value);
        weights.set(node.key(), 10);
      }
    }

    for (let asteroid of asteroids) {
      const asteroidPos = asteroid.components.get(CPosition.id) as CPosition;
      const node = map.grid.getClosestNodeFromPosition(asteroidPos.value);
      weights.set(node.key(), 100);
    }

    map.grid.setConstraints(weights);

    return map;
  }
}