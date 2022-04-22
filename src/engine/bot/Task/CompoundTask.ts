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

    public findSatisfiedMethods(worldState: WorldState): Method<T>[] {
        if (this.methods.length === 0) {
            return [];
        }

        let methods: Method<T>[] = [];
        this.methods.forEach((method) => {
            if (method.canBeRun(worldState)) {
                methods.push(method);
            }
        })

        return methods;
    }
}