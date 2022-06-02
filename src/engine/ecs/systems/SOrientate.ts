import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { COrientation } from '../components/COrientation';
import { CActionTurn } from '../components/CActionTurn';
import { CActionMine } from '../components/CActionMine';
import { CBouncing } from '../components/CBouncing';
import { CPosition } from '../components/CPosition';
import { Vect2D } from '../../utils/Vect2D';
import { MyMath } from '../../utils/MyMath';

export class SOrientate implements ISystem {
    public id = 'Orientate';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        let entities = ecs.selectEntitiesFromComponents([COrientation.id, CActionTurn.id]);

        for (let entity of entities) {
            const rotation = entity.components.get('ActionTurn') as CActionTurn;
            const orientation = entity.components.get(COrientation.id) as COrientation;

            orientation.angle = orientation.angle + rotation.angle;
            ecs.addOrUpdateComponentOnEntity(entity, orientation);
            ecs.removeComponentOnEntity(entity, rotation);
        }

        // Make sure the mining ship keep facing the asteroid during the bouncing
        entities = ecs.selectEntitiesFromComponents([COrientation.id, CActionMine.id, CPosition.id, CBouncing.id]);
        for (let entity of entities) {
            const orientation = entity.components.get(COrientation.id) as COrientation;
            const mining = entity.components.get(CActionMine.id) as CActionMine;
            const pos = entity.components.get(CPosition.id) as CPosition;

            const trajectory = Vect2D.sub(mining.target, pos.temporaryValue);
            const rotationAngleInRadian = orientation.heading.angleWithVector(trajectory);
            const rotationAngleInDegree = MyMath.radianToDegree(rotationAngleInRadian);
            orientation.angle = orientation.angle + rotationAngleInDegree;
            ecs.addOrUpdateComponentOnEntity(entity, orientation);
        }
    }
}