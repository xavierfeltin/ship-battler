import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { TFireAt } from "./TFireAt";
import { Method } from "./Method";
import { WorldState } from "../WorldState";

export class CTAttackEnnemy<T extends {isMoving: number; isInRange: number; hasEnnemyToAttack: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            const hasEnnemyToAttack = worldState.getState(indexes.hasEnnemyToAttack) === 1;
            return hasEnnemyToAttack;
        };
        let method = new Method<T>(predicate);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.AGRESSIVE));
        method.pushTask(new TFireAt<T>(indexes));
        this.methods.push(method);
    }
}