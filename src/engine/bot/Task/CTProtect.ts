import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { WorldState } from "../WorldState";

export class CTProtect<T extends {isMoving: number; isInRange: number; isTargetHasMoved: number; hasShipToProtect: number; hasFoundMenaceOnProtectedShip: number}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicateMenace = (worldState: WorldState): boolean => {
            const hasShipToProtect = worldState.getState(indexes.hasShipToProtect) === 1;
            const hasFoundMenaceOnProtectedShip = worldState.getState(indexes.hasFoundMenaceOnProtectedShip) === 1;
            return hasShipToProtect && hasFoundMenaceOnProtectedShip;
        };
        let method = new Method<T>(predicateMenace);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.INTERCEPTING));
        this.methods.push(method);

        let predicateFollow = (worldState: WorldState): boolean => {
            const hasShipToProtect = worldState.getState(indexes.hasShipToProtect) === 1;
            return hasShipToProtect;
        };
        method = new Method<T>(predicateFollow);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.PROTECTING));
        this.methods.push(method);
    }
}