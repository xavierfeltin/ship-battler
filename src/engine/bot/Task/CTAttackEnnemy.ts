import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { TFireAt } from "./TFireAt";
import { Method } from "./Method";
import { WorldState } from "../WorldState";

export class CTAttackEnnemy<T extends {isMoving: number; isInRange: number; hasTargetMoved: number; hasEnnemyToAttack: number; isReadyToFire: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicateAttack = (worldState: WorldState): boolean => {
            const hasEnnemyToAttack = worldState.getState(indexes.hasEnnemyToAttack) === 1;
            const isReadyToFire = worldState.getState(indexes.isReadyToFire) === 1;
            return hasEnnemyToAttack && isReadyToFire;
        };
        let method = new Method<T>(predicateAttack);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.AGRESSIVE));
        method.pushTask(new TFireAt<T>(indexes));
        this.methods.push(method);

        let predicateFollowTarget = (worldState: WorldState): boolean => {
            const hasEnnemyToAttack = worldState.getState(indexes.hasEnnemyToAttack) === 1;
            return hasEnnemyToAttack;
        };
        method = new Method<T>(predicateFollowTarget);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.AGRESSIVE));
        this.methods.push(method);
    }
}