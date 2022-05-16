import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { IEntity } from '../IEntity';
import { CActionTurn } from '../components/CActionTurn';
import { CMap } from '../components/CMap';
import { CCannon } from '../components/CCannon';
import { CShip } from '../components/CShip';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';

export class SFinalizeFrame implements ISystem {
  public id = 'FinalizeFrame';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    this.finalizeShips(ecs);
    this.finalizeCollisions(ecs);
  }

  private finalizeShips(ecs: ECSManager) {
    const entities = ecs.selectEntitiesFromComponents([CShip.id]);
    for (let ship of entities) {
        this.coolDownCannons(ship, ecs);
        this.deleteFrameComponents(ship, ecs);
    }
  }

  private coolDownCannons(ship: IEntity, ecs: ECSManager): void {
    const cannon = ship.components.get(CCannon.id) as CCannon;
    if (cannon !== undefined) {
        if (cannon.isCooldownOver()) {
          cannon.reset();
        }
        else if (cannon.hasFired) {
          cannon.decrement();
        }
        ecs.addOrUpdateComponentOnEntity(ship, cannon);
    }
  }

  private deleteFrameComponents(ship: IEntity, ecs: ECSManager): void {
    const turn = ship.components.get(CActionTurn.id) as CActionTurn;
    if (turn !== undefined)
      ecs.removeComponentOnEntity(ship, turn);

    const map = ship.components.get(CMap.id) as CMap;
    if (map !== undefined)
      ecs.removeComponentOnEntity(ship, map);

    /*
    const orientation = ship.components.get(COrientation.id) as COrientation;
    if (orientation !== undefined)
      ecs.removeComponentOnEntity(ship, orientation);
    */
  }

  // Reset collision history for the new frame
  private finalizeCollisions(ecs: ECSManager): void {
    const previousCollisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.PreviousCollisions);
    if (previousCollisionsEntity !== undefined) {
        const previousCollisions = previousCollisionsEntity.components.get('Collisions') as CCollisions;
        previousCollisions.collisions = [];
        ecs.addOrUpdateComponentOnEntity(previousCollisionsEntity, previousCollisions);
    }

    const collisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.Collisions);
    if (collisionsEntity !== undefined) {
        const collisions = collisionsEntity.components.get('Collisions') as CCollisions;
        collisions.collisions = [];
        ecs.addOrUpdateComponentOnEntity(collisionsEntity, collisions);
    }
  }
}