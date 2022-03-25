import { Domain } from "./Domain";
import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";
//import { Vect2D } from "../utils/Vect2D";
//import { AGoTo } from "./Action/AGoTo";
import { IAActionState /*, IAIAction*/ } from "./IAIAction";
import { CompoundTask } from "./Task/CompoundTask";
import { Task } from "./Task/Task";

export class Planner<T> {
    private planning: Task<T>[]; //IAIAction[];
    private actionBeingSolved: Task<T> | undefined;; //IAIAction | undefined;

    public constructor() {
        this.planning = [];
        this.actionBeingSolved = undefined;
    }

    public planify(domain: Domain<T>, agent: IEntity): IComponent | undefined {
        domain.updateWorldState(agent);

        // If action being solved is over or no longer valid, get next action on planning
        // if planning no longer valid, regenerate a planning
        if (this.actionBeingSolved === undefined || this.actionBeingSolved.state === IAActionState.DONE) {
            console.log("[Planify] the current action is now done. Start a new one");

            if(this.planning.length === 0) {
                this.buildPlanning(domain, agent);
            }
            this.actionBeingSolved = this.planning.pop();
        }
        // else the current action is still being solved
        const nextActionToPerformByAgent = this.solve(agent);
        return nextActionToPerformByAgent;
    }

    private solve(agent: IEntity): IComponent | undefined {
        if (this.actionBeingSolved === undefined) {
            return undefined;
        }

        let nextAction = this.actionBeingSolved.operate(agent);
        return nextAction;
    }

    private buildPlanning(domain: Domain<T>, agent: IEntity): void {
        console.log("[BuildPlanning] generate a new planning for agent " + agent.name);
        /*
        let destX = Math.floor(Math.random() * 1200);
        let destY = Math.floor(Math.random() * 800);
        let to = new Vect2D(destX, destY);

        let goToAction = new AGoTo(agent, to);
        let previsional: IAIAction[] = [goToAction];
        this.planning = previsional.reverse();
        */

        let availableTasks: (Task<T> | CompoundTask<T>)[] = domain.getAvailableTasks();
        let worlState = domain.getWorldState();

        while(availableTasks.length > 0) {
            let currentTask: Task<T> | CompoundTask<T> | undefined = availableTasks.pop();
            if (currentTask instanceof CompoundTask) {
                let satisfiedMethod = currentTask.findSatisfiedMethod(worlState);
                if (satisfiedMethod !== undefined) {
                    const methodTasks = satisfiedMethod.decompose();
                    availableTasks = availableTasks.concat(methodTasks);
                }
                else {
                    // restore to last decomposed task
                }
            }
            else if (currentTask instanceof Task) {
                //Primitive task
                if (currentTask.canBeRun(worlState)) {
                    worlState = currentTask.applyEffects(worlState);
                    this.planning.push(currentTask);
                }
                else {
                    // restore to last decomposed task
                }
            }
        }
        //this.planning = this.planning.reverse();
    }
}