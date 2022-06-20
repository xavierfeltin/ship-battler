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
import { IEntity } from '../IEntity';
import { CNavigation } from '../components/CNavigation';
import { CActionMine } from '../components/CActionMine';
import { CShipSensor } from '../components/CShipSensor';

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

      let actions: IComponent[] = [];
      if (planner.bot.isNeedingAReplanification(cdomain.domain)) {
        this.resetAgentActionsForReplanning(entity, ecs);
        // Stop all actions and force a replanification
        actions = planner.bot.replanify(cdomain.domain, entity);
      }
      else {
        // Start a new planning if all actions have been solved or pursue current planning
        actions = planner.bot.planify(cdomain.domain, entity);
      }

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

  private resetAgentActionsForReplanning(agent: IEntity, ecs: ECSManager) {
    const navigation = agent.components.get(CNavigation.id) as CNavigation;
    if (navigation !== undefined) {
      ecs.removeComponentOnEntity(agent, navigation);
    }

    const mining = agent.components.get(CActionMine.id) as CActionMine;
    if (mining !== undefined) {
      ecs.removeComponentOnEntity(agent, mining);
    }

    const shipSensor = agent.components.get(CShipSensor.id) as CShipSensor;
    if (shipSensor !== undefined) {
      shipSensor.reset();
      ecs.addOrUpdateComponentOnEntity(agent, shipSensor);
    }

    /*
    const orientate = agent.components.get(COrientation.id) as COrientation;
    if (orientate !== undefined) {
      ecs.removeComponentOnEntity(agent, orientate);
    }
    */
  }
}