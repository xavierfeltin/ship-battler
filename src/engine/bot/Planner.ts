import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";
import { Vect2D } from "../utils/Vect2D";
import { AGoTo } from "./Action/AGoTo";
import { IAActionState, IAIAction } from "./IAIAction";

export class Planner {
    private planning: IAIAction[];
    private actionBeingSolved: IAIAction | undefined;

    public constructor() {
        this.planning = [];
        this.actionBeingSolved = undefined
    }

    public planify(agent: IEntity): IComponent | undefined {

        // If action being solved is over or no longer valid, get next action on planning
        // if planning no longer valid, regenerate a planning
        if (this.actionBeingSolved === undefined || this.actionBeingSolved.state === IAActionState.DONE) {
            console.log("[Planify] the current action is now done. Start a new one");

            if(this.planning.length === 0) {
                this.buildPlanning(agent);
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

        let nextAction = this.actionBeingSolved.solve(agent);
        return nextAction;
    }

    private buildPlanning(agent: IEntity): void {
        console.log("[BuildPlanning] generate a new planning for agent " + agent.name);
        let destX = Math.floor(Math.random() * 1200);
        let destY = Math.floor(Math.random() * 800);
        let to = new Vect2D(destX, destY);

        let goToAction = new AGoTo(agent, to);
        let previsional: IAIAction[] = [goToAction];
        this.planning = previsional.reverse();
    }
}