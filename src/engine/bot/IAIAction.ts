import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";

export enum IAActionState {
    NONE,
    ONGOING,
    DONE
};
export interface IAIAction {
    readonly id: string;
    state: IAActionState;
    solve: (agent: IEntity) => IComponent | undefined;
}