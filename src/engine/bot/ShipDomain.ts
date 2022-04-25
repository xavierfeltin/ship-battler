import { Domain } from "./Domain";
import { CTBeShip } from "./Task/CTBeShip";

export class ShipDomain<T extends {isMoving: number; isInRange: number; hasWeapon: number;}> extends Domain<T> {
    public constructor(indexes: T) {
        super(indexes);
        this.worldState.changeState(this.indexes.isMoving, 0);
        this.worldState.changeState(this.indexes.isInRange, 0);
        this.worldState.changeState(this.indexes.hasWeapon, 0);

        this.pushTask(new CTBeShip<T>(indexes));
    }

    public updateWorldState(index: number, value: number): void {
        this.worldState.changeState(index, value);
    }
}