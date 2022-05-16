import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';
import { CLife } from '../components/CLife';
import { CMissile } from '../components/CMissile';

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
    for (let collision of collisions.collisions) {
        const shipEntity = ecs.selectEntityFromId(collision.idA);
        const missileEntity = ecs.selectEntityFromId(collision.idB);

        if (shipEntity === undefined || missileEntity === undefined) {
            console.warn("Ship or missile could not been found to solve damage following collisions");
            continue;
        }

        const shipLife = shipEntity.components.get(CLife.id) as CLife;

        const missile = missileEntity.components.get(CMissile.id) as CMissile;
        const missileTTL = missileEntity.components.get(CLife.id) as CLife;

        shipLife.value = Math.max(0, shipLife.value - missile.damage);
        ecs.addOrUpdateComponentOnEntity(shipEntity, shipLife);

        missileTTL.value = 0;
        ecs.addOrUpdateComponentOnEntity(missileEntity, missileTTL);
    }
  }
}