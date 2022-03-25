import { IComponent } from "./IComponent";

export interface IEntity {
    readonly name: string;
    components: Map<string, IComponent>
}