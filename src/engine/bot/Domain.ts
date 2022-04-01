import { CompoundTask } from "./Task/CompoundTask";
import { Task } from "./Task/Task";
import { WorldState } from "./WorldState";

export class Domain<T> {
    private tasks: (Task<T> | CompoundTask<T>)[];
    protected worldState: WorldState;
    private _indexes: T;
    public get indexes(): T {
        return this._indexes;
    }
    protected set indexes(value: T) {
        this._indexes = value;
    }

    public constructor(indexes: T) {
        this.tasks = [];
        this.worldState = new WorldState();
        this._indexes = indexes;
    }

    public pushTask(task: Task<T> | CompoundTask<T>): void {
        this.tasks.push(task);
    }

    public getAvailableTasks(): (Task<T> | CompoundTask<T>)[] {
        return [...this.tasks];
    }

    public updateWorldState(index: number, value: number): void {
        return;
    }

    public getWorldState(): WorldState {
        return this.worldState;
    }
}