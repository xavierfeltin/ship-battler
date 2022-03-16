import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";

export interface IAIAction {
    readonly id: string;
    solve: (agent: IEntity) => IComponent;
}