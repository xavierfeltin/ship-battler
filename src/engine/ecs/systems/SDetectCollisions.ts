import { ISystem } from '../ISystem';
import { Collision, CollisionHelper, COLLISION_TYPE } from '../../utils/UCollision';
import { CCollisions } from '../components/CCollisions';
import { ECSManager } from '../ECSManager';
import { CTimeFrame } from '../components/CTimeFrame';
import { CRigidBody } from '../components/CRigidBody';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { GameEnityUniqId } from '../../GameEngine';
import { CShip } from '../components/CShip';
import { CMissile } from '../components/CMissile';
import { CIgnore } from '../components/CIgnore';
import { Vect2D } from '../../utils/Vect2D';
import { CAsteroid } from '../components/CAsteroid';

export class SDetectCollisions implements ISystem {
  public id = 'DetectCollisions';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const ships = ecs.selectEntitiesFromComponents([CShip.id, CRigidBody.id, CPosition.id, CVelocity.id], [CIgnore.id]);
        const missiles = ecs.selectEntitiesFromComponents([CMissile.id, CRigidBody.id, CPosition.id, CVelocity.id], [CIgnore.id]);
        const asteroids = ecs.selectEntitiesFromComponents([CAsteroid.id, CRigidBody.id, CPosition.id]);

        const entityCollision = ecs.selectEntityFromId(GameEnityUniqId.Collisions);
        const entityTimeFrame = ecs.selectEntityFromId(GameEnityUniqId.TimeFrame);

        if (entityCollision === undefined || entityTimeFrame === undefined) {
            console.error("[SDetectCollisions] The collision entity or the time frame entity have not been declared");
            return;
        }

        const collisions: CCollisions = entityCollision.components.get(CCollisions.id) as CCollisions;
        const previousCollision = ecs.selectEntityFromId(GameEnityUniqId.PreviousCollisions)?.components.get(CCollisions.id) as CCollisions;
        const timeFrame = entityTimeFrame.components.get(CTimeFrame.id) as CTimeFrame;

        let firstCollision: Collision = CollisionHelper.createEmptyCollision();

        // Detect for now collisions between ships and missiles
        // Ignore collisions between ships, and between missiles
        for (let shipEntity of ships) {
            const rbA = shipEntity.components.get('RigidBody') as CRigidBody;
            const posA = shipEntity.components.get('Position') as CPosition;
            const velA = shipEntity.components.get('Velocity') as CVelocity;

            // collisions with asteroids
            for (let asteroidEntity of asteroids) {
                const rbB: CRigidBody = asteroidEntity.components.get('RigidBody') as CRigidBody;
                const posB: CPosition = asteroidEntity.components.get('Position') as CPosition;
                const velB: Vect2D = new Vect2D(0, 0);

                let alreadyCollidedThisFrame = this.hasAlreayCollidedThisFrame(shipEntity.name, asteroidEntity.name, previousCollision.collisions);
                /*
                if(this.isCollisionBetweenStaticElements(velA.value, velB)) {
                    break;
                }
                */

                // Do not detect collision when a missile is colliding with its the ship is originated from
                if (this.isCollisionEligible(shipEntity.name, asteroidEntity.name, alreadyCollidedThisFrame)) {
                    firstCollision = this.detectNewFirstCollision(
                        shipEntity.name,
                        posA.temporaryValue,
                        velA.value,
                        rbA.radius,
                        asteroidEntity.name,
                        posB.value,
                        velB,
                        rbB.radius,
                        firstCollision,
                        timeFrame.time,
                        COLLISION_TYPE.ShipAsteroid);
                }
            }

            // Collision with ships
            for (let otherShipEntity of ships) {
                const rbB: CRigidBody = otherShipEntity.components.get('RigidBody') as CRigidBody;
                const posB: CPosition = otherShipEntity.components.get('Position') as CPosition;
                const velB: CVelocity = otherShipEntity.components.get('Velocity') as CVelocity;

                let alreadyCollidedThisFrame = this.hasAlreayCollidedThisFrame(shipEntity.name, otherShipEntity.name, previousCollision.collisions);
                /*
                if(this.isCollisionBetweenStaticElements(velA.value, velB.value)) {
                    break;
                }
                */

                // Do not detect collision with itself
                if (this.isCollisionEligible(shipEntity.name, otherShipEntity.name, alreadyCollidedThisFrame)) {
                    firstCollision = this.detectNewFirstCollision(
                        shipEntity.name,
                        posA.temporaryValue,
                        velA.value,
                        rbA.radius,
                        otherShipEntity.name,
                        posB.temporaryValue,
                        velB.value,
                        rbB.radius,
                        firstCollision,
                        timeFrame.time,
                        COLLISION_TYPE.ShipShip);
                }
            }

            // Collision with missiles
            for (let missileEntity of missiles) {
                const rbB: CRigidBody = missileEntity.components.get('RigidBody') as CRigidBody;
                const posB: CPosition = missileEntity.components.get('Position') as CPosition;
                const velB: CVelocity = missileEntity.components.get('Velocity') as CVelocity;
                const missile: CMissile = missileEntity.components.get('Missile') as CMissile;

                let alreadyCollidedThisFrame = this.hasAlreayCollidedThisFrame(shipEntity.name, missileEntity.name, previousCollision.collisions);
                /*

                if(this.isCollisionBetweenStaticElements(velA.value, velB.value)) {
                    break;
                }
                */

                // Do not detect collision when a missile is colliding with its the ship is originated from
                if (this.isCollisionEligible(shipEntity.name, missile.shipId, alreadyCollidedThisFrame)) {
                    firstCollision = this.detectNewFirstCollision(
                        shipEntity.name,
                        posA.temporaryValue,
                        velA.value,
                        rbA.radius,
                        missileEntity.name,
                        posB.temporaryValue,
                        velB.value,
                        rbB.radius,
                        firstCollision,
                        timeFrame.time,
                        COLLISION_TYPE.ShipMissile);
                }
            }

            // Not necessary for now: Collision with area for moving objects
            /*
            if ((velA.value.norm > 0)
                && (posA.value.x - rbA.radius < 0.0 || posA.value.x + rbA.radius > area.width
                || posA.value.y - rbA.radius < 0.0 || posA.value.y + rbA.radius > area.height)) {
                const collision = CollisionHelper.createCollision(ship, 'area', posA.value, new Vect2D(0,0), velA.velocity, new Vect2D(0, 0), rbA.radius, 0, 0);
                firstCollision = collision;
            }
            */
        }

        if (firstCollision.collisionTime !== -1) {
            timeFrame.time = timeFrame.time + firstCollision.collisionTime;
            collisions.push(firstCollision);
        }
        else {
            timeFrame.time = 1.0;
        }

        ecs.addOrUpdateComponentOnEntity(entityCollision, collisions);
        ecs.addOrUpdateComponentOnEntity(entityTimeFrame, timeFrame);
    }

    private hasAlreayCollidedThisFrame(idA: string, idB: string, previousCollisionsThisFrame: Collision[]): boolean {
        let alreadyCollidedThisFrame = false;
        for (const prevColl of previousCollisionsThisFrame) {
            if ((prevColl.idA === idA && prevColl.idB === idB)
            || (prevColl.idA === idB && prevColl.idB === idA)) {
                alreadyCollidedThisFrame = true;
                break;
            }
        }

        return alreadyCollidedThisFrame;
    }

    private isCollisionEligible(idA: string, idB: string, hasAlreadyCollidedThisFrame: boolean): boolean {
        return idA !== idB && !hasAlreadyCollidedThisFrame;
    }

    private isCollisionBetweenStaticElements(velA: Vect2D, velB: Vect2D): boolean {
        return (velA.x === 0 && velA.y === 0
            && velB.x === 0 && velB.y === 0)
    }

    private detectNewFirstCollision(idA: string, posA: Vect2D, velA: Vect2D, radiusA: number, idB: string, posB: Vect2D, velB: Vect2D, radiusB: number, firstCollision: Collision, time: number, type: COLLISION_TYPE): Collision {
        // detect collisions
        const newCollision = CollisionHelper.detectCollision(
            idA, idB,
            posA, posB,
            velA, velB,
            radiusA, radiusB,
            firstCollision,
            type);


        // If the collision happens earlier than the current one we keep it
        const collisionTime = newCollision.collisionTime + time;
        const isNewCollisionHappenedDuringThisFrame = 0.0 <= collisionTime && collisionTime < 1.0;
        const isFirstCollisionEmpty = CollisionHelper.isCollisionEmpty(firstCollision);
        const isNewCollisionHappenedBeforeFirstOne = newCollision.collisionTime < firstCollision.collisionTime;
        if (isNewCollisionHappenedDuringThisFrame && (isFirstCollisionEmpty || isNewCollisionHappenedBeforeFirstOne)) {
            return newCollision;
        }
        else {
            return firstCollision;
        }
    }
}