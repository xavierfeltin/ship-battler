import { WorldState } from "../WorldState";
import { Method } from "./Method";

export class CompoundTask<T> {
    protected methods: Method<T>[];

    public constructor() {
        this.methods = [];
    }

    public pushMethod(method: Method<T>): void {
        this.methods.push(method);
    }

    public findSatisfiedMethod(worldState: WorldState): Method<T> | undefined {
        if (this.methods.length === 0) {
            return undefined;
        }

        let canBeRun: boolean = false;
        let current: Method<T> | undefined = undefined;
        let index = 0;
        while (!canBeRun && index < this.methods.length) {
            current = this.methods[index];
            canBeRun = current.canBeRun(worldState);

            if (!canBeRun) {
                index++;
            }
        }
        return current;
    }
}