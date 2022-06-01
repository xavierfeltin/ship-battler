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
import { CLife } from '../components/CLife';
import { CCannon } from '../components/CCannon';
import { GameEnityUniqId } from '../../GameEngine';

export class SFire implements ISystem {
    public id = 'Fire';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([CActionFire.id, CCannon.id]);
        const canvas = ecs.selectEntityFromId(GameEnityUniqId.Canvas);

        if (!canvas) {
            return;
        }

        for (let entity of entities) {
            const fire = entity.components.get(CActionFire.id) as CActionFire;
            this.addMissile(fire, ecs, canvas.components.get(CCanvas.id) as CCanvas);
            ecs.removeComponentOnEntity(entity, fire);

            const cannon = entity.components.get(CCannon.id) as CCannon;
            cannon.activate();
            ecs.addOrUpdateComponentOnEntity(entity, cannon);
        }
    }

    private addMissile(action: CActionFire, ecs: ECSManager, canvas: CCanvas) {
        const speed = 10;

        let components = new Map<string, IComponent>();
        components.set(CMissile.id, new CMissile(action.originId));
        components.set(CRigidBody.id, new CRigidBody(5, 1));
        components.set(CSpeed.id, new CSpeed(speed));
        components.set(CPosition.id, new CPosition(action.originPos));
        components.set(COrientation.id, new COrientation(action.angle));
        components.set(CLife.id, new CLife(60));

        const velocity = new Vect2D(0, 0);
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