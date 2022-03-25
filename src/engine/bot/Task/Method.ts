import { Task } from "./Task";
import { CompoundTask } from "./CompoundTask";
import { WorldState } from "../WorldState";

export class Method<T> {
    protected tasks: (Task<T> | CompoundTask<T>)[];

    public constructor() {
        this.tasks = [];
    }

    public canBeRun(worldState: WorldState): boolean {
        return true;
    }

    public decompose(): (Task<T> | CompoundTask<T>)[] {
        return this.tasks;
    }

    public pushTask(task: Task<T> | CompoundTask<T> ): void {
        this.tasks.push(task);
    }
}