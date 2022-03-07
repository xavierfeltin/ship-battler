import { ECSManager } from "./ECSManager";

export interface ISystem {
    readonly id: string;
    readonly priority: number;
    onUpdate: (ecs: ECSManager) => void;
}