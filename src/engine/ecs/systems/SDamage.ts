import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';
import { CLife } from '../components/CLife';
import { CMissile } from '../components/CMissile';
import { CIgnore } from '../components/CIgnore';
import { Collision, COLLISION_TYPE } from '../../utils/UCollision';

export class SDamage implements ISystem {
  public id = 'Damage';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    const entityCollision = ecs.selectEntityFromId(GameEnityUniqId.Collisions);
    if (entityCollision === undefined) {
        return;
    }

    const collisions = entityCollision.components.get(CCollisions.id) as CCollisions;
    const collisionsToSolve = collisions.collisions.filter((collision: Collision) => {
      return collision.type === COLLISION_TYPE.ShipMissile;
    })

    for (let collision of collisionsToSolve) {
        const shipEntity = ecs.selectEntityFromId(collision.idA);
        const missileEntity = ecs.selectEntityFromId(collision.idB);

        if (shipEntity === undefined || missileEntity === undefined) {
            console.warn("Ship or missile could not been found to solve damage following collisions");
            continue;
        }

        const shipLife = shipEntity.components.get(CLife.id) as CLife;
        const missile = missileEntity.components.get(CMissile.id) as CMissile;

        shipLife.value = Math.max(0, shipLife.value - missile.damage);
        ecs.addOrUpdateComponentOnEntity(shipEntity, shipLife);

        if (shipLife.value === 0) {
          const deadComponent = new CIgnore();
          ecs.addOrUpdateComponentOnEntity(shipEntity, deadComponent);
        }

        const deadComponent = new CIgnore();
        ecs.addOrUpdateComponentOnEntity(missileEntity, deadComponent);
    }
  }
}