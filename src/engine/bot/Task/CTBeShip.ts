import { CompoundTask } from "./CompoundTask";
import { TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { CTAttackEnnemy } from "./CTAttackEnnemy";
import { WorldState } from "../WorldState";

export class CTBeShip<T extends {isMoving: number; isInRange: number; hasWeapon: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicateKill = (worldState: WorldState): boolean => {
            const hasWeapon: boolean = worldState.getState(indexes.hasWeapon) === 1;
            return hasWeapon;
        }
        let method = new Method<T>(predicateKill);
        method.pushTask(new CTAttackEnnemy<T>(indexes));
        method.pushTask(new TNavigateTo<T>(indexes));
        this.methods.push(method);

        let predicateFind = (worldState: WorldState): boolean => {
            return true;
        }
        method = new Method<T>(predicateFind);
        method.pushTask(new TNavigateTo<T>(indexes));
        this.methods.push(method);
    }
}