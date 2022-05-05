import { CActionFire } from "../../ecs/components/CActionFire";
import { CPosition } from "../../ecs/components/CPosition";
import { CShipSensor } from "../../ecs/components/CShipSensor";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { Vect2D } from "../../utils/Vect2D";
import { IAActionState } from "../IAIAction";
import { WorldState } from "../WorldState";
import { Task } from "./Task";

export class TFireAt<T extends {isInRange: number; hasEnnemyToAttack: number;}> extends Task<T> {
    public constructor(indexes: T) {
        super(indexes);
    }

    public canBeRun(worldState: WorldState): boolean {
        const hasEnnemyToAttack = worldState.getState(this.indexes.hasEnnemyToAttack) === 1
        const isInRange = worldState.getState(this.indexes.isInRange) === 1;
        return hasEnnemyToAttack && isInRange;
    }

    public applyEffects(worldState: WorldState): WorldState {
        return worldState;
    }

    public operate(agent: IEntity): IComponent | undefined {
        const shipSensor: CShipSensor = agent.components.get(CShipSensor.id) as CShipSensor;
        if (shipSensor && shipSensor.detectedPos) {
            const target = shipSensor.detectedPos;
            const pos = agent.components.get(CPosition.id) as CPosition;

            const heading = Vect2D.sub(target, pos.value);
            heading.normalize();
            //console.log("From: " + pos.value.key() + ", To: " + target.key() + ", " + heading.key());

            return new CActionFire(new Vect2D(pos.value.x, pos.value.y), heading);
        }

        // One time action (for now)
        this.state = IAActionState.DONE;

        return undefined;
    }

    public info(): string {
        return "FireAt"
    }
}