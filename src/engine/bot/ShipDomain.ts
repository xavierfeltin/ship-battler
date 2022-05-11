import { Domain } from "./Domain";
import { CTBeShip } from "./Task/CTBeShip";

export class ShipDomain<T extends {isMoving: number; isInRange: number; hasEnnemyToAttack: number; hasAsteroidToMine: number; isMining: number, isReadyToFire: number}> extends Domain<T> {
    public constructor(indexes: T) {
        super(indexes);
        this.worldState.changeState(this.indexes.isMoving, 0);
        this.worldState.changeState(this.indexes.isInRange, 0);
        this.worldState.changeState(this.indexes.hasEnnemyToAttack, 0);
        this.worldState.changeState(this.indexes.hasAsteroidToMine, 0);
        this.worldState.changeState(this.indexes.isMining, 0);
        this.worldState.changeState(this.indexes.isReadyToFire, 0);

        this.pushTask(new CTBeShip<T>(indexes));
    }

    public updateWorldState(index: number, value: number): void {
        this.worldState.changeState(index, value);
    }
}