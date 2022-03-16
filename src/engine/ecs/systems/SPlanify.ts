import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPlanner } from '../components/CPlanner';
import { IComponent } from '../IComponent';
import { CShip } from '../components/CShip';
import { CPosition } from '../components/CPosition';

export class SPlanify implements ISystem {
  public id = 'Planify';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CPosition.id, CPlanner.id]);

    for (let entity of entities) {
        const planner = entity.components.get(CPlanner.id) as CPlanner;
        const action: IComponent | undefined = planner.bot.solve(entity);

        if (action !== undefined) {
          ecs.addOrUpdateComponentOnEntity(entity, action);
        }
        else {
          console.warn("The planner returned an undefined action for entity " + entity.name);
        }
    }
  }
}