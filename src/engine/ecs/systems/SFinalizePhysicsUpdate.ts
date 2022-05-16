import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { IEntity } from '../IEntity';
import { CMissile } from '../components/CMissile';
import { CLife } from '../components/CLife';
import { CShip } from '../components/CShip';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';

export class SFinalizePhysicsUpdate implements ISystem {
  public id = 'FinalizePhysicsUpdate';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    this.finalizeMissiles(ecs);
    this.finalizeShips(ecs);
    this.finalizeCollisions(ecs);
  }

  private finalizeMissiles(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CMissile.id]);
    for (let missile of entities) {
        this.consumeFuelOrExplode(missile, ecs);
    }
  }

  private consumeFuelOrExplode(missile: IEntity, ecs: ECSManager): void {
    const life = missile.components.get(CLife.id) as CLife;
    if (life !== undefined && life.value === 0) {
        ecs.removeEntity(missile.name);
    }
  }

  private finalizeShips(ecs: ECSManager) {
    const entities = ecs.selectEntitiesFromComponents([CShip.id]);
    for (let ship of entities) {
        this.destroyShip(ship, ecs);
    }
  }

  private destroyShip(ship: IEntity, ecs: ECSManager): void {
    const life = ship.components.get(CLife.id) as CLife;
    if (life.value === 0) {
      ecs.removeEntity(ship.name);
    }
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
    previousCollisions.collisions = [...collisions.collisions];
    ecs.addOrUpdateComponentOnEntity(previousCollisionsEntity, previousCollisions);

    // Reset current collisions for next time increment
    collisions.collisions = [];
    ecs.addOrUpdateComponentOnEntity(collisionsEntity, collisions);
  }
}