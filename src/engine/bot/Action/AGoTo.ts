import { CActionTurn } from "../../ecs/components/CActionTurn";
import { GridWithWeights } from "../../utils/GridWithWeigth";
import { PathFinding } from "../../utils/Pathfinding";
import { Vect2D } from "../../utils/Vect2D";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { CPosition } from "../../ecs/components/CPosition";
import { CRigidBody } from "../../ecs/components/CRigidBody";
import { COrientation } from "../../ecs/components/COrientation";
import { IAActionState, IAIAction } from "../IAIAction";
import { CMap } from "../../ecs/components/CMap";
import { MyMath } from "../../utils/MyMath";

export class AGoTo implements IAIAction{
    public static id: string = "GoTo";
    public id: string = AGoTo.id;

    private _state: IAActionState;
    public get state(): IAActionState {
        return this._state;
    }
    public set state(value: IAActionState) {
        this._state = value;
    }

    private from: Vect2D;
    private to: Vect2D;
    private map: GridWithWeights;
    private path: Vect2D[];
    private nextPoint: Vect2D | undefined;

    public constructor(agent: IEntity, to: Vect2D) {
        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        this.from = fromPosition.value;
        this.to = to;
        this._state = IAActionState.NONE;

        const agentMap = agent.components.get(CMap.id) as CMap;
        this.map = agentMap.grid;

        const result = PathFinding.aStarSearch(this.map, this.from, this.to);
        this.path = PathFinding.reconstructPath(this.map, result.cameFrom, this.from, this.to);

        this.nextPoint = this.path.pop(); //remove current position
    }

    public solve(agent: IEntity): IComponent | undefined {
        this.state = IAActionState.ONGOING;

        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        const orientation = agent.components.get(COrientation.id) as COrientation;
        const rigidBody = agent.components.get(CRigidBody.id) as CRigidBody;

        this.from = fromPosition.value;
        if (this.nextPoint === undefined || this.from.distance(this.nextPoint) < rigidBody.radius) {
            const waypoint  = this.getNextWaypoint();

            const nextPointKey = this.nextPoint === undefined ? "undefined" : this.nextPoint.key();
            const waypointKey = waypoint === undefined ? "undefined" : waypoint.key();
            console.log("[AGoTo] waypoint reached " + nextPointKey + " by standing at " + this.from.key() + ", go to next waypoint " + waypointKey);
            this.nextPoint = waypoint;
        }
        else {
            const nextPointKey = this.nextPoint === undefined ? "undefined" : this.nextPoint.key();
            console.log("[AGoTo] keep going to " + nextPointKey + " by standing at " + this.from.key());
        }

        const nextAction = this.goTo(this.from, this.nextPoint, orientation.heading);
        if (nextAction === undefined) {
            this.state = IAActionState.DONE;
        }

        return nextAction;
    }

    private getNextWaypoint(): Vect2D | undefined {
        const next: Vect2D | undefined = this.path.pop();
        return next;
    }

    private goTo(from: Vect2D, to: Vect2D | undefined, heading: Vect2D): IComponent | undefined {
        if (to === undefined)
        {
            return undefined;
        }

        const trajectory = Vect2D.sub(to, from);
        const rotationAngleInRadian = heading.angleWithVector(trajectory);
        const rotationAngleInDegree = MyMath.radianToDegree(rotationAngleInRadian);

        console.log("From: " + from.key() + ", To: " + to.key() + ", " + trajectory.key() + ", heading: " + heading.key() + ", rotation: " + rotationAngleInDegree);

        return new CActionTurn(rotationAngleInDegree);
    }
}