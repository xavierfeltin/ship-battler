import { Domain } from "./Domain";
import { CTAttackEnnemy } from "./Task/CTAttackEnnemy";

export class ShipDomain<T extends {isMoving: number; isInRange: number;}> extends Domain<T> {
    public constructor(indexes: T) {
        super(indexes);
        this.worldState.changeState(this.indexes.isMoving, 0);
        this.worldState.changeState(this.indexes.isInRange, 0);

        this.pushTask(new CTAttackEnnemy<T>(indexes));
    }

    public updateWorldState(index: number, value: number): void {
        this.worldState.changeState(index, value);
    }
}