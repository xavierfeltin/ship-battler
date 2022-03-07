import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPlanner } from '../components/CPlanner';
import { IComponent } from '../IComponent';

export class SPlanify implements ISystem {
  public id = 'Planify';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CPlanner.id]);

    for (let entity of entities) {
        const planner = entity.components.get(CPlanner.id) as CPlanner;
        const action: IComponent = planner.bot.planify();

        ecs.addOrUpdateComponentOnEntity(entity, action);
    }
  }
}