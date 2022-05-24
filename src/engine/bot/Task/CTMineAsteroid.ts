import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { WorldState } from "../WorldState";
import { TMineAt } from "./TMineAt";

export class CTMineAsteroid<T extends {isMoving: number; isInRange: number; isTargetHasMoved: number; hasAsteroidToMine: number; isMining: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            const hasAsteroidToMine: boolean = worldState.getState(indexes.hasAsteroidToMine) === 1;
            return hasAsteroidToMine;
        };
        let method = new Method<T>(predicate);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.MINING));
        method.pushTask(new TMineAt<T>(indexes));
        this.methods.push(method);
    }
}