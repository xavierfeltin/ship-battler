import { CActionFire } from "../../ecs/components/CActionFire";
import { COrientation } from "../../ecs/components/COrientation";
import { CPosition } from "../../ecs/components/CPosition";
import { CShipSensor } from "../../ecs/components/CShipSensor";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { Vect2D } from "../../utils/Vect2D";
import { IAActionState } from "../IAIAction";
import { WorldState } from "../WorldState";
import { Task } from "./Task";

export class TFireAt<T extends {isInRange: number; hasEnnemyToAttack: number; isReadyToFire: number;}> extends Task<T> {
    public constructor(indexes: T) {
        super(indexes);
    }

    public canBeRun(worldState: WorldState): boolean {
        const hasEnnemyToAttack = worldState.getState(this.indexes.hasEnnemyToAttack) === 1
        const isInRange = worldState.getState(this.indexes.isInRange) === 1;
        const isReady = worldState.getState(this.indexes.isReadyToFire) === 1;
        return hasEnnemyToAttack && isInRange && isReady;
    }

    public applyEffects(worldState: WorldState): WorldState {
        worldState.changeState(this.indexes.isReadyToFire, 0); // cannon goes into cool down
        return worldState;
    }

    public operate(agent: IEntity): IComponent[] {
        const shipSensor: CShipSensor = agent.components.get(CShipSensor.id) as CShipSensor;
        if (shipSensor && shipSensor.mainDetectedPos) {
            const pos = agent.components.get(CPosition.id) as CPosition;
            const orientation = agent.components.get(COrientation.id) as COrientation;

            console.log("[TFireAt] " + agent.name + " towards " + shipSensor.mainDetectedShipId + " at " + shipSensor.mainDetectedPos.key());
            return [new CActionFire(agent.name, new Vect2D(pos.value.x, pos.value.y), orientation.angle)];
        }

        // One time action (for now)
        this.state = IAActionState.DONE;

        return [];
    }

    public info(): string {
        return "FireAt"
    }
}