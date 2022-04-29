import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { COrientation } from '../components/COrientation';
import { Vect2D } from '../../utils/Vect2D';
import { CPosition } from '../components/CPosition';
import { IComponent } from '../IComponent';
import { CCanvas } from '../components/CCanvas';
import { CActionMine } from '../components/CActionMine';
import { IEntity } from '../IEntity';
import { CLife } from '../components/CLife';
import { CTarget } from '../components/CTarget';
import { CMiningBeam } from '../components/CMiningBeam';
import { CRenderer } from '../components/CRenderer';

export class SMine implements ISystem {
    public id = 'Mine';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([CActionMine.id]);
        const canvas = ecs.selectEntityFromId('Canvas');

        if (!canvas) {
            return;
        }

        for (let ship of entities) {
            const mine = ship.components.get(CActionMine.id) as CActionMine;
            const asteroid =  ecs.selectEntityFromId(mine.asteroidId);
            if (asteroid !== undefined) {
                const isFullyMined = this.mineAsteroid(asteroid, ecs);
                if (isFullyMined) {
                    ecs.removeComponentOnEntity(ship, mine);
                    ecs.removeEntity(asteroid.name);
                }
                else {
                    this.addMiningBeam(mine, ecs, canvas.components.get(CCanvas.id) as CCanvas);
                }
            }
        }
    }

    private mineAsteroid(asteroid: IEntity, ecs: ECSManager): boolean {
        let life: CLife = asteroid.components.get(CLife.id) as CLife;
        life.value = life.value - 1;
        ecs.addOrUpdateComponentOnEntity(asteroid, life);
        return life.value > 0;
    }

    private addMiningBeam(mineAction: CActionMine, ecs: ECSManager, canvas: CCanvas) {
        const heading = mineAction.heading;
        const target = mineAction.target;
        const origin = mineAction.origin;

        let components = new Map<string, IComponent>();
        components.set(CMiningBeam.id, new CMiningBeam());
        components.set(CPosition.id, new CPosition(origin));
        components.set(CTarget.id, new CTarget(target));

        const uVector = new Vect2D(1, 0);
        const angle = uVector.angleWithVector(heading);
        components.set(COrientation.id, new COrientation(angle));

        components.set(CRenderer.id, new CRenderer({
            ctx: canvas.ctx
        }));

        ecs.addEntity(components);
    }
}