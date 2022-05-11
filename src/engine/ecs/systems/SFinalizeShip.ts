import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CShip } from '../components/CShip';
import { IEntity } from '../IEntity';
import { CCannon } from '../components/CCannon';
import { CActionTurn } from '../components/CActionTurn';
import { CMap } from '../components/CMap';
import { COrientation } from '../components/COrientation';

export class SFinalizeShip implements ISystem {
  public id = 'FinalizeShip';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
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
}