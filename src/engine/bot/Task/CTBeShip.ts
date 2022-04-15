import { CompoundTask } from "./CompoundTask";
import { TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { CTAttackEnnemy } from "./CTAttackEnnemy";
import { WorldState } from "../WorldState";

export class CTBeShip<T extends {isMoving: number; isInRange: number; hasWeapon: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicate = (worldState: WorldState): boolean => {
            return true;
        }
        let method = new Method<T>(predicate);
        method.pushTask(new CTAttackEnnemy<T>(indexes));
        method.pushTask(new TNavigateTo<T>(indexes));
        this.methods.push(method);
    }
}