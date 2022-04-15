import { Task } from "./Task";
import { CompoundTask } from "./CompoundTask";
import { WorldState } from "../WorldState";

export class Method<T> {
    protected tasks: (Task<T> | CompoundTask<T>)[];
    protected predicate: (worldState: WorldState) => boolean;

    public constructor(predicate: (worldState: WorldState) => boolean) {
        this.tasks = [];
        this.predicate = predicate;
    }

    public canBeRun(worldState: WorldState): boolean {
        return this.predicate(worldState);
    }

    public decompose(): (Task<T> | CompoundTask<T>)[] {
        return this.tasks;
    }

    public pushTask(task: Task<T> | CompoundTask<T> ): void {
        this.tasks.push(task);
    }
}