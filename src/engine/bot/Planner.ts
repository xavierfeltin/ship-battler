import { CActionTurn } from "../ecs/components/CActionTurn";
import { IComponent } from "../ecs/IComponent";

export class Planner {
    public constructor() {

    }

    public planify(): IComponent {
        return new CActionTurn(2);
    }
}