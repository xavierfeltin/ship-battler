import { ISystem } from '../ISystem';
import { Collision, CollisionHelper } from '../../utils/UCollision';
import { CCollisions } from '../components/CCollisions';
import { ECSManager } from '../ECSManager';
import { CTimeFrame } from '../components/CTimeFrame';
import { CRigidBody } from '../components/CRigidBody';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { GameEnityUniqId } from '../../GameEngine';
import { CShip } from '../components/CShip';
import { CMissile } from '../components/CMissile';

export class SDetectCollisions implements ISystem {
  public id = 'DetectCollisions';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const ships = ecs.selectEntitiesFromComponents([CShip.id, CRigidBody.id, CPosition.id, CVelocity.id], ['HasToBeDeleted']);
        const missiles = ecs.selectEntitiesFromComponents([CMissile.id, CRigidBody.id, CPosition.id, CVelocity.id], ['HasToBeDeleted']);

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

            // Collision with other objects
            for (let missileEntity of missiles) {
                const rbB: CRigidBody = missileEntity.components.get('RigidBody') as CRigidBody;
                const posB: CPosition = missileEntity.components.get('Position') as CPosition;
                const velB: CVelocity = missileEntity.components.get('Velocity') as CVelocity;
                const missile: CMissile = missileEntity.components.get('Missile') as CMissile;

                let alreadyCollidedThisFrame = false;
                for (const prevColl of previousCollision.collisions) {
                    if ((prevColl.idA === shipEntity.name && prevColl.idB === missileEntity.name)
                    || (prevColl.idA === missileEntity.name && prevColl.idB === shipEntity.name)) {
                        alreadyCollidedThisFrame = true;
                        break;
                    }
                }

                // detection between static elements, could not happen
                if (velA.value.x === 0 && velA.value.y === 0
                && velB.value.x === 0 && velB.value.y === 0) {
                    break;
                }

                // Do not detect collision when a missile is colliding with its the ship is originated from
                if (shipEntity.name !== missile.shipId && !alreadyCollidedThisFrame) {
                    // detect collisions
                    const newCollision = CollisionHelper.detectCollision(
                        shipEntity.name, missileEntity.name,
                        posA.value, posB.value,
                        velA.value, velB.value,
                        rbA.radius, rbB.radius,
                        firstCollision);

                    // If the collision happens earlier than the current one we keep it
                    const collisionTime = newCollision.collisionTime + timeFrame.time;
                    const isNewCollisionHappenedDuringThisFrame = 0.0 <= collisionTime && collisionTime < 1.0;
                    const isFirstCollisionEmpty = CollisionHelper.isCollisionEmpty(firstCollision);
                    const isNewCollisionHappenedBeforeFirstOne = newCollision.collisionTime < firstCollision.collisionTime;
                    if (isNewCollisionHappenedDuringThisFrame && (isFirstCollisionEmpty || isNewCollisionHappenedBeforeFirstOne)) {
                        firstCollision = newCollision;
                    }
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
}