import { CActionTurn } from "../../ecs/components/CActionTurn";
import { GridWithWeights } from "../../utils/GridWithWeigth";
import { PathFinding } from "../../utils/Pathfinding";
import { Vect2D } from "../../utils/Vect2D";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { CPosition } from "../../ecs/components/CPosition";
import { CRigidBody } from "../../ecs/components/CRigidBody";
import { COrientation } from "../../ecs/components/COrientation";
import { IAIAction } from "../IAIAction";
import { CMap } from "../../ecs/components/CMap";

export class AGoTo implements IAIAction{
    public static id: string = "GoTo";
    public id: string = AGoTo.id;

    private from: Vect2D;
    private to: Vect2D;
    private map: GridWithWeights;
    private path: Vect2D[];
    private nextPoint: Vect2D | undefined;

    public constructor(agent: IEntity, to: Vect2D) {
        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        this.from = fromPosition.value;
        this.to = to;

        const agentMap = agent.components.get(CMap.id) as CMap;
        this.map = agentMap.grid;

        const result = PathFinding.aStarSearch(this.map, this.from, this.to);
        this.path = PathFinding.reconstructPath(result.cameFrom, this.from, this.to);

        this.nextPoint = this.path.pop(); //remove current position
    }

    public solve(agent: IEntity): IComponent {
        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        const orientation = agent.components.get(COrientation.id) as COrientation;
        const rigidBody = agent.components.get(CRigidBody.id) as CRigidBody;

        this.from = fromPosition.value;
        if (this.nextPoint === undefined || this.from.distance(this.nextPoint) < rigidBody.radius) {
            this.nextPoint = this.getNextWaypoint();
        }

        const nextAction = this.goTo(this.from, this.nextPoint, orientation.heading);
        return nextAction;
    }

    private getNextWaypoint(): Vect2D | undefined {
        const next: Vect2D | undefined = this.path.length === 0 ? this.nextPoint : this.path.pop();
        return next;
    }

    private goTo(from: Vect2D, to: Vect2D | undefined, heading: Vect2D): IComponent {
        if (to === undefined)
        {
            return new CActionTurn(0);
        }

        const trajectory = Vect2D.sub(to, from);
        const rotationAngle = heading.angleWithVector(trajectory);
        return new CActionTurn(rotationAngle);
    }
}