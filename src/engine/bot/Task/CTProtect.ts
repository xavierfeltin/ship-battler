import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { WorldState } from "../WorldState";

export class CTProtect<T extends {isMoving: number; isInRange: number; hasShipToProtect: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            const hasShipToProtect = worldState.getState(indexes.hasShipToProtect) === 1;
            return hasShipToProtect;
        };
        let method = new Method<T>(predicate);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.PROTECTING));
        this.methods.push(method);
    }
}