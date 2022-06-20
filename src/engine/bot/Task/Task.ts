import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { IAActionState } from "../IAIAction";
import { WorldState } from "../WorldState";

export class Task<T> {
    protected indexes: T;

    protected _state: IAActionState;
    public get state(): IAActionState {
        return this._state;
    }
    public set state(value: IAActionState) {
        this._state = value;
    }
    public constructor(indexes: T) {
        this._state = IAActionState.NONE;
        this.indexes = indexes;
    }

    public isNeedingReplanify(worldState: WorldState): boolean {
        return !this.canBeRun(worldState);
    }

    public canBeRun(worldState: WorldState): boolean {
        let couldRun = true;
        return couldRun;
    }

    public applyEffects(worldState: WorldState): WorldState {
        return worldState;
    }

    public operate(agent: IEntity): IComponent[] {
        return [];
    }

    public info(): string {
        return "";
    }
}