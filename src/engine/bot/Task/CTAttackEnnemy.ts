import { CompoundTask } from "./CompoundTask";
import { TNavigateTo } from "./TNavigateTo";
import { TFireAt } from "./TFireAt";
import { Method } from "./Method";
import { WorldState } from "../WorldState";

export class CTAttackEnnemy<T extends {isMoving: number; isInRange: number; hasWeapon: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            const hasWeapon = worldState.getState(indexes.hasWeapon) === 1;
            return hasWeapon;
        };
        let method = new Method<T>(predicate);
        method.pushTask(new TNavigateTo<T>(indexes));
        method.pushTask(new TFireAt<T>(indexes));
        this.methods.push(method);
    }
}