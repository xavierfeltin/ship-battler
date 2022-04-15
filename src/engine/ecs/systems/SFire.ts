import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { COrientation } from '../components/COrientation';
import { CActionFire } from '../components/CActionFire';
import { Vect2D } from '../../utils/Vect2D';
import { CMissile } from '../components/CMissile';
import { CRigidBody } from '../components/CRigidBody';
import { CSpeed } from '../components/CSpeed';
import { CPosition } from '../components/CPosition';
import { CVelocity } from '../components/CVelocity';
import { MissileResources } from '../../resources/RMissile';
import { IComponent } from '../IComponent';
import { CRenderer } from '../components/CRenderer';
import { CCanvas } from '../components/CCanvas';

export class SFire implements ISystem {
    public id = 'Fire';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([CActionFire.id]);
        const canvas = ecs.selectEntityFromId('Canvas');

        if (!canvas) {
            return;
        }

        for (let entity of entities) {
            const fire = entity.components.get(CActionFire.id) as CActionFire;

            this.addMissile(fire.origin, fire.heading, ecs, canvas.components.get(CCanvas.id) as CCanvas);
            ecs.removeComponentOnEntity(entity, fire);
        }
    }

    private addMissile(origin: Vect2D, heading: Vect2D, ecs: ECSManager, canvas: CCanvas) {
        const speed = 10;

        let components = new Map<string, IComponent>();
        components.set(CMissile.id, new CMissile());
        components.set(CRigidBody.id, new CRigidBody(20));
        components.set(CSpeed.id, new CSpeed(speed));
        components.set(CPosition.id, new CPosition(origin));

        const uVector = new Vect2D(1, 0);
        const angle = uVector.angleWithVector(heading);
        components.set(COrientation.id, new COrientation(angle));

        const velocity = new Vect2D(heading.x * speed, heading.y * speed);
        components.set(CVelocity.id, new CVelocity(velocity));
        components.set(CRenderer.id, new CRenderer({
            width: 20,
            height: 20,
            sprite: MissileResources.GetSpriteBase64(),
            ctx: canvas.ctx
        }));
        ecs.addEntity(components);
    }
}