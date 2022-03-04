import { ECSManager } from "./ECSManager";

export interface ISystem {
    readonly name: string;
    readonly priority: number;
    onUpdate: (ecs: ECSManager) => void;
}