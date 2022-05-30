import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';
import { Collision, COLLISION_TYPE } from '../../utils/UCollision';
import { IEntity } from '../IEntity';
import { CShip } from '../components/CShip';
import { Vect2D } from '../../utils/Vect2D';
import { CVelocity } from '../components/CVelocity';

export class SBounce implements ISystem {
  public id = 'Bounce';
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
      return collision.type === COLLISION_TYPE.ShipShip;
    })

    for (let collision of collisionsToSolve) {
        const shipAEntity = ecs.selectEntityFromId(collision.idA);
        const shipBEntity = ecs.selectEntityFromId(collision.idB);

        if (shipAEntity === undefined || shipBEntity === undefined) {
            console.warn("Ship A or ship B could not been found to solve damage following collisions");
            continue;
        }

        // Solve bouncing collision between A and B
        this.bounce(shipAEntity, shipBEntity, collision, ecs);
    }
  }

  // Manage the bounce effect due to the impact of two ships
  private bounce(shipAEntity: IEntity, shipBEntity: IEntity, collision: Collision, ecs: ECSManager): void {
    const shipA = shipAEntity.components.get(CShip.id) as CShip;
    const shipB = shipBEntity.components.get(CShip.id) as CShip;

    const massCoefficient = (shipA.mass + shipB.mass) / (shipA.mass * shipB.mass);
    const vectDistance = Vect2D.sub(collision.posA, collision.posB);
    let distance2 = collision.posA.distance2(collision.posB);
    if (distance2 === 0) {
      distance2 = 1; // neutral element for division later
    }

    const speedVector = Vect2D.sub(collision.velA, collision.velB);

    //fx and fy are the components of the impact vector. product is just there for optimisation purposes
    const product = speedVector.x * vectDistance.x + speedVector.y * vectDistance.y;
    let fx = (vectDistance.x * product) / (distance2 * massCoefficient)
    let fy = (vectDistance.y * product) / (distance2 * massCoefficient)

    // Apply the impact vector once
    let impactA = new Vect2D(fx / shipA.mass, fy / shipA.mass);
    let velA = Vect2D.sub(collision.velA, impactA);

    let impactB = new Vect2D(fx / shipB.mass, fy / shipB.mass);
    let velB = Vect2D.add(collision.velB, impactB);

    // If the norm of the impact vector is less than 120, we normalize it to 120
    let impulse = Math.sqrt(fx * fx + fy * fy)
    if (impulse === 0) {
      impulse = 1;
    }

    if (impulse < 120.0) {
      fx = (fx * 120.0) / impulse;
      fy = (fy * 120.0) / impulse;
    }

    //We apply the impact vector a second time
    impactA = new Vect2D(fx / shipA.mass, fy / shipA.mass);
    velA = Vect2D.sub(velA, impactA);

    impactB = new Vect2D(fx / shipB.mass, fy / shipB.mass);
    velB = Vect2D.add(velB, impactB);

    const shipAVelocity = shipAEntity.components.get(CVelocity.id) as CVelocity;
    shipAVelocity.value = velA;
    ecs.addOrUpdateComponentOnEntity(shipAEntity, shipAVelocity);

    const shipBVelocity = shipBEntity.components.get(CVelocity.id) as CVelocity;
    shipBVelocity.value = velB;
    ecs.addOrUpdateComponentOnEntity(shipBEntity, shipBVelocity);
  }
}