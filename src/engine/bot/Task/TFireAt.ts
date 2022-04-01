import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { IAActionState } from "../IAIAction";
import { WorldState } from "../WorldState";
import { Task } from "./Task";

export class TFireAt<T extends {isInRange: number;}> extends Task<T> {
    public constructor(indexes: T) {
        super(indexes);
    }

    public canBeRun(worldState: WorldState): boolean {
        return worldState.getState(this.indexes.isInRange) === 1;
    }

    public applyEffects(worldState: WorldState): WorldState {
        return worldState;
    }

    public operate(agent: IEntity): IComponent | undefined {
        console.log("FIRE !!!");
        this.state = IAActionState.DONE
        return undefined;
    }
}