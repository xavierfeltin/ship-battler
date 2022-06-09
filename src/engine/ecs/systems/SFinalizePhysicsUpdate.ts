import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';

export class SFinalizePhysicsUpdate implements ISystem {
  public id = 'FinalizePhysicsUpdate';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    this.finalizeCollisions(ecs);
  }

  // Register collisions into history to not detect them again at the next time increment
  private finalizeCollisions(ecs: ECSManager): void {
    const previousCollisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.PreviousCollisions);
    const collisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.Collisions);

    if (previousCollisionsEntity === undefined || collisionsEntity === undefined) {
        return;
    }

    const previousCollisions = previousCollisionsEntity.components.get('Collisions') as CCollisions;
    const collisions = collisionsEntity.components.get('Collisions') as CCollisions;
    previousCollisions.collisions = previousCollisions.collisions.concat(...collisions.collisions);
    ecs.addOrUpdateComponentOnEntity(previousCollisionsEntity, previousCollisions);

    // Reset current collisions for next time increment
    collisions.collisions = [];
    ecs.addOrUpdateComponentOnEntity(collisionsEntity, collisions);
  }
}