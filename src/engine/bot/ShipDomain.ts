import { Domain } from "./Domain";
import { CTBeShip } from "./Task/CTBeShip";

export class ShipDomain<T extends {isMoving: number; isInRange: number; hasTargetMoved: number; hasEnnemyToAttack: number; hasAsteroidToMine: number; hasShipToProtect: number; hasFoundMenaceOnProtectedShip: number; isMining: number, isReadyToFire: number}> extends Domain<T> {
    public constructor(indexes: T) {
        super(indexes);
        this.worldState.changeState(this.indexes.isMoving, 0);
        this.worldState.changeState(this.indexes.isInRange, 0);
        this.worldState.changeState(this.indexes.hasEnnemyToAttack, 0);
        this.worldState.changeState(this.indexes.hasAsteroidToMine, 0);
        this.worldState.changeState(this.indexes.isMining, 0);
        this.worldState.changeState(this.indexes.isReadyToFire, 0);
        this.worldState.changeState(this.indexes.hasShipToProtect, 0);
        this.worldState.changeState(this.indexes.hasFoundMenaceOnProtectedShip, 0);
        this.worldState.changeState(this.indexes.hasTargetMoved, 0);

        this.pushTask(new CTBeShip<T>(indexes));
    }

    public updateWorldState(index: number, value: number): void {
        this.worldState.changeState(index, value);
    }
}