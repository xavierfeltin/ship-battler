import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";
import { GridWithWeights } from "../utils/GridWithWeigth";
import { Vect2D } from "../utils/Vect2D";
import { AGoTo } from "./Action/AGoTo";
import { IAIAction } from "./IAIAction";

export class Planner {
    private planning: IAIAction[];
    private actionBeingSolved: IAIAction | undefined;

    public constructor() {
        this.planning = [];
        this.actionBeingSolved = undefined
    }

    public planify(agent: IEntity, grid: GridWithWeights): void {

        // If action being solved is over or no longer valid, get next action on planning
        // if planning no longer valid, regenerate a planning

        let to = new Vect2D(600, 600); // should be computed
        let goToAction = new AGoTo(agent, to);
        let previsional: IAIAction[] = [goToAction];
        this.planning = previsional.reverse();
        this.actionBeingSolved = this.planning.pop();
    }

    public solve(agent: IEntity): IComponent | undefined {
        if (this.actionBeingSolved === undefined) {
            return undefined;
        }

        let nextAction = this.actionBeingSolved.solve(agent);
        return nextAction;
    }
}