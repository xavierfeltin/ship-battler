import { IEntity } from "../ecs/IEntity";
import { CompoundTask } from "./Task/CompoundTask";
import { Task } from "./Task/Task";
import { WorldState } from "./WorldState";

export class Domain<T> {
    private tasks: (Task<T> | CompoundTask<T>)[];
    protected worldState: WorldState;
    protected indexes: T;

    public constructor(indexes: T) {
        this.tasks = [];
        this.worldState = new WorldState();
        this.indexes = indexes;
    }

    public pushTask(task: Task<T> | CompoundTask<T>): void {
        this.tasks.push(task);
    }

    public getAvailableTasks(): (Task<T> | CompoundTask<T>)[] {
        return [...this.tasks];
    }

    public updateWorldState(agent: IEntity): void {
        return;
    }

    public getWorldState(): WorldState {
        return this.worldState;
    }
}