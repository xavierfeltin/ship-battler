import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { IComponent } from '../IComponent';
import { CMap } from '../components/CMap';
import { CShip } from '../components/CShip';
import { CRenderer } from '../components/CRenderer';
import { IEntity } from '../IEntity';

export class SBuildMap implements ISystem {
  public id = 'BuildMap';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id]);
    const area = ecs.selectEntityFromId('Area')?.components.get(CRenderer.id) as CRenderer;

    const width = area.attr.width || 0;
    const height = area.attr.height || 0;
    const granularity = 20;

    for (let entity of entities) {
        let map = this.buildMap(entity, width, height, granularity);
        ecs.addOrUpdateComponentOnEntity(entity, map);
    }
  }

  private buildMap(entity: IEntity, width: number, height: number, granularity: number): CMap {
    let weights = new Map<string, number>();

    // TODO: compute map depending of the other entities on the map detected by the current entity

    let map = new CMap({
      width: width,
      height: height,
      granularity: granularity
    }, weights);
    return map;
  }
}