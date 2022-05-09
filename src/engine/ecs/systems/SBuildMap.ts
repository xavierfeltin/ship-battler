import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CMap } from '../components/CMap';
import { CShip } from '../components/CShip';
import { CRenderer } from '../components/CRenderer';
import { IEntity } from '../IEntity';
import { CPosition } from '../components/CPosition';

export class SBuildMap implements ISystem {
  public id = 'BuildMap';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id]);
    const area = ecs.selectEntityFromId('Area')?.components.get(CRenderer.id) as CRenderer;

    const width = area.attr.width || 0;
    const height = area.attr.height || 0;
    const granularity = 20; // same as rigid body of a ship

    for (let entity of entities) {
        let map = this.buildMap(entity, entities, width, height, granularity);
        ecs.addOrUpdateComponentOnEntity(entity, map);
    }
  }

  private buildMap(entity: IEntity, ships: IEntity[], width: number, height: number, granularity: number): CMap {

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
    map.grid.setConstraints(weights);

    return map;
  }
}