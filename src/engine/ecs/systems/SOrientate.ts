import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { COrientation } from '../components/COrientation';
import { CActionTurn } from '../components/CActionTurn';

export class SOrientate implements ISystem {
    public id = 'Orientate';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([COrientation.id, CActionTurn.id]);

        for (let entity of entities) {
            const rotation = entity.components.get('ActionTurn') as CActionTurn;
            const orientation = entity.components.get(COrientation.id) as COrientation;

            orientation.angle = orientation.angle + rotation.angle;
            ecs.addOrUpdateComponentOnEntity(entity, orientation);
            ecs.removeComponentOnEntity(entity, rotation);
        }
    }
}