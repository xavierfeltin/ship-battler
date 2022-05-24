import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CPlanner } from '../components/CPlanner';
import { IComponent } from '../IComponent';
import { CShip } from '../components/CShip';
import { CPosition } from '../components/CPosition';
import { CMap } from '../components/CMap';
import { CRigidBody } from '../components/CRigidBody';
import { CDomain } from '../components/CDomain';
import { CIgnore } from '../components/CIgnore';

export class SPlanify implements ISystem {
  public id = 'Planify';
  public priority: number;

    public constructor(priority: number) {
      this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CShip.id, CDomain.id, CPosition.id, CPlanner.id, CMap.id, CRigidBody.id], [CIgnore.id]);

    for (let entity of entities) {
      const planner = entity.components.get(CPlanner.id) as CPlanner<{isMoving: 0, isInRange: 1, hasAsteroidToMine: 3, isMining: 4, hasShipToProtect: 6}>;
      const cdomain = entity.components.get(CDomain.id) as CDomain<{isMoving: 0, isInRange: 1, hasAsteroidToMine: 3, isMining: 4, hasShipToProtect: 6}>;
      const actions: IComponent[] = planner.bot.planify(cdomain.domain, entity);

      if (actions.length > 0) {
        console.log("Next actions for " + entity.name + ": " + JSON.stringify(actions));
        for (let action of actions) {
          ecs.addOrUpdateComponentOnEntity(entity, action);
        }
      }
      else {
        console.warn("The planner returned no action to perform for entity " + entity.name);
      }
    }
  }
}