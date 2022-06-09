import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';
import { Collision, COLLISION_TYPE } from '../../utils/UCollision';
import { IEntity } from '../IEntity';
import { Vect2D } from '../../utils/Vect2D';
import { CBouncing } from '../components/CBouncing';
import { CRigidBody } from '../components/CRigidBody';
import { CPosition } from '../components/CPosition';
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
      return collision.type === COLLISION_TYPE.ShipShip || collision.type === COLLISION_TYPE.ShipAsteroid;
    })

    for (let collision of collisionsToSolve) {
        const entityA = ecs.selectEntityFromId(collision.idA);
        const entityB = ecs.selectEntityFromId(collision.idB);

        if (entityA === undefined || entityB === undefined) {
            console.warn("[Bounce] Entity A or entity B could not been found to solve damage following collisions");
            continue;
        }

        // Solve bouncing collision between A and B
        this.bounce(entityA, entityB, collision, ecs);
        //this.bounceWikipedia(entityA, entityB, collision, ecs);
    }
  }

  // Manage the bounce effect due to the impact of two ships
  // https://www.codingame.com/forum/t/magus-explanatory-document-about-coders-strike-back/1628/4
  private bounce(entityA: IEntity, entityB: IEntity, collision: Collision, ecs: ECSManager): void {
    const rbA = entityA.components.get(CRigidBody.id) as CRigidBody;
    const rbB = entityB.components.get(CRigidBody.id) as CRigidBody;

    const massCoefficient = (rbA.mass + rbB.mass) / (rbA.mass * rbB.mass);

    /*
    const vectDistance = Vect2D.sub(collision.posA, collision.posB);
    let distance2 = collision.posA.distance2(collision.posB);
    */

    const posA = entityA.components.get(CPosition.id) as CPosition;
    const posB = entityB.components.get(CPosition.id) as CPosition;
    const vectDistance = Vect2D.sub(posA.temporaryValue, posB.temporaryValue);
    let distance2 = posA.temporaryValue.distance2(posB.temporaryValue);

    if (distance2 === 0) {
      distance2 = 1; // neutral element for division later
    }

    let speedVector = Vect2D.sub(collision.velB, collision.velA);

    //fx and fy are the components of the impact vector. product is just there for optimisation purposes
    const product = speedVector.x * vectDistance.x + speedVector.y * vectDistance.y;
    let fx = (vectDistance.x * product) / (distance2 * massCoefficient)
    let fy = (vectDistance.y * product) / (distance2 * massCoefficient)

    // Apply the impact vector once
    let impactA = new Vect2D(fx / rbA.mass, fy / rbA.mass);
    let velA = Vect2D.sub(collision.velA, impactA);

    let impactB = new Vect2D(fx / rbB.mass, fy / rbB.mass);
    let velB = Vect2D.add(collision.velB, impactB);

    // If the norm of the impact vector is less than 120, we normalize it to 120
    let impulse = Math.sqrt(fx * fx + fy * fy)
    if (impulse === 0) {
      impulse = 1;
    }

    const minImpulseForce = 20.0; // decided through experience
    if (impulse < minImpulseForce) {
      fx = (fx * minImpulseForce) / impulse;
      fy = (fy * minImpulseForce) / impulse;
    }

    //We apply the impact vector a second time
    impactA = new Vect2D(fx / rbA.mass, fy / rbA.mass);
    velA = Vect2D.sub(velA, impactA);

    impactB = new Vect2D(fx / rbB.mass, fy / rbB.mass);
    velB = Vect2D.add(velB, impactB);

    const bouncingDurationInFrames = 1; // decided through experience
    const bouncingA = new CBouncing(velA, bouncingDurationInFrames);
    ecs.addOrUpdateComponentOnEntity(entityA, bouncingA);

    const bouncingB = new CBouncing(velB, bouncingDurationInFrames);
    ecs.addOrUpdateComponentOnEntity(entityB, bouncingB);
  }
}