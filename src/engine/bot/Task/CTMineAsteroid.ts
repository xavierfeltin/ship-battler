import { CompoundTask } from "./CompoundTask";
import { TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { WorldState } from "../WorldState";
import { TMineAt } from "./TMineAt";

export class CTMineAsteroid<T extends {isMoving: number; isInRange: number; isMining: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            return true;
        };
        let method = new Method<T>(predicate);
        method.pushTask(new TNavigateTo<T>(indexes));
        method.pushTask(new TMineAt<T>(indexes));
        this.methods.push(method);
    }
}