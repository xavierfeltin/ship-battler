import { CompoundTask } from "./CompoundTask";
import { NAVMODE, TNavigateTo } from "./TNavigateTo";
import { Method } from "./Method";
import { CTAttackEnnemy } from "./CTAttackEnnemy";
import { WorldState } from "../WorldState";
import { CTMineAsteroid } from "./CTMineAsteroid";
import { CTProtect } from "./CTProtect";

export class CTBeShip<T extends {isMoving: number; isInRange: number; hasEnnemyToAttack: number; hasAsteroidToMine: number; hasShipToProtect: number; isMining: number; isReadyToFire: number}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let predicateMine = (worldState: WorldState): boolean => {
            const hasAsteroidToMine: boolean = worldState.getState(indexes.hasAsteroidToMine) === 1;
            return hasAsteroidToMine;
        }
        let method = new Method<T>(predicateMine);
        method.pushTask(new CTMineAsteroid<T>(indexes));
        this.methods.push(method);

        let predicateAttack = (worldState: WorldState): boolean => {
            const hasEnnemyToAttack: boolean = worldState.getState(indexes.hasEnnemyToAttack) === 1;
            const isNotMining: boolean = worldState.getState(indexes.isMining) === 0;
            return hasEnnemyToAttack && isNotMining;
        }
        method = new Method<T>(predicateAttack);
        method.pushTask(new CTAttackEnnemy<T>(indexes));
        this.methods.push(method);

        let predicateProtect = (worldState: WorldState): boolean => {
            const hasShipToProtect: boolean = worldState.getState(indexes.hasShipToProtect) === 1;
            return hasShipToProtect;
        }
        method = new Method<T>(predicateProtect);
        method.pushTask(new CTProtect<T>(indexes));
        this.methods.push(method);

        let predicateFind = (worldState: WorldState): boolean => {
            const isNotMining: boolean = worldState.getState(indexes.isMining) === 0;
            return isNotMining;
        }
        method = new Method<T>(predicateFind);
        method.pushTask(new TNavigateTo<T>(indexes, NAVMODE.RANDOM));
        this.methods.push(method);
    }
}