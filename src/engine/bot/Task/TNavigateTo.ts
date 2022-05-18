import { CActionTurn } from "../../ecs/components/CActionTurn";
import { GridWithWeights } from "../../utils/GridWithWeigth";
import { PathFinding } from "../../utils/Pathfinding";
import { Vect2D } from "../../utils/Vect2D";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { CPosition } from "../../ecs/components/CPosition";
import { CRigidBody } from "../../ecs/components/CRigidBody";
import { COrientation } from "../../ecs/components/COrientation";
import { IAActionState } from "../IAIAction";
import { CMap } from "../../ecs/components/CMap";
import { MyMath } from "../../utils/MyMath";
import { Task } from "./Task";
import { WorldState } from "../WorldState";
import { CShipSensor } from "../../ecs/components/CShipSensor";
import { CAsteroidSensor } from "../../ecs/components/CAsteroidSensor";
import { CShip } from "../../ecs/components/CShip";

export enum NAVMODE {
    AGRESSIVE,
    MINING,
    PROTECTING,
    RANDOM
};
export class TNavigateTo<T extends {isMoving: number; isInRange: number}> extends Task<T> {
    public static id: string = "GoTo";
    public id: string = TNavigateTo.id;

    private from: Vect2D;
    private to: Vect2D;
    private navMode: NAVMODE;
    private stopAtDistance: number;
    private map: GridWithWeights;
    private path: Vect2D[];
    private nextPoint: Vect2D | undefined;

    public constructor(indexes: T, mode: NAVMODE) {
        super(indexes);

        this.from = new Vect2D(0, 0);
        this.to = new Vect2D(0, 0);
        this.navMode = mode;
        this.stopAtDistance = 0;
        this.map = new GridWithWeights(0, 0, 0);
        this.path = [];
    }

    public canBeRun(worldState: WorldState): boolean {
        // For now always can navigate to some place even if already on movement
        return true;
    }

    public applyEffects(worldState: WorldState): WorldState {
        worldState.changeState(this.indexes.isMoving, 1); // When the flag is reset to 0 ???
        worldState.changeState(this.indexes.isInRange, 1); // At the end we suppose to be in range of the target
        return worldState;
    }

    public operate(agent: IEntity): IComponent | undefined {
        if (this.state === IAActionState.DONE || this.state === IAActionState.NONE) {
            this.definePath(agent);
        }

        this.state = IAActionState.ONGOING;

        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        const orientation = agent.components.get(COrientation.id) as COrientation;

        this.from = fromPosition.value;
        if (this.nextPoint === undefined || this.from.distance(this.nextPoint) <= this.stopAtDistance) {
            const waypoint  = this.getNextWaypoint();
            this.nextPoint = waypoint;
        }

        const nextAction = this.goTo(this.from, this.nextPoint, orientation.heading);
        if (nextAction === undefined) {
            this.state = IAActionState.DONE;
        }

        return nextAction;
    }

    private definePath(agent: IEntity) {
        const fromPosition: CPosition = agent.components.get(CPosition.id) as CPosition;
        const shipInfo: CShip = agent.components.get(CShip.id) as CShip;
        this.from = fromPosition.value;

        const shipSensor: CShipSensor = agent.components.get(CShipSensor.id) as CShipSensor;
        const asteroidSensor: CAsteroidSensor = agent.components.get(CAsteroidSensor.id) as CAsteroidSensor;
        switch(this.navMode) {
            case NAVMODE.AGRESSIVE:
                if (shipSensor !== undefined && shipSensor.detectedPos !== undefined) {
                    this.to = shipSensor.detectedPos;
                    console.log("Follow ship target " + shipSensor.detectedShipId);
                }
                if (shipInfo !== undefined) {
                    this.stopAtDistance = shipInfo.shootingDistance;
                }
                break;
            case NAVMODE.MINING:
                if (asteroidSensor !== undefined && asteroidSensor.detectedPos !== undefined) {
                    this.to = asteroidSensor.detectedPos;
                    console.log("Follow asteroid target " + asteroidSensor.detectedAsteroidId);
                }
                if (shipInfo !== undefined) {
                    this.stopAtDistance = shipInfo.miningDistance;
                }
                break;
            case NAVMODE.PROTECTING:
                if (shipSensor !== undefined && shipSensor.detectedPos !== undefined) {
                    this.to = shipSensor.detectedPos;
                    console.log("Follow ship to protect " + shipSensor.detectedShipId);
                }
                if (shipInfo !== undefined) {
                    this.stopAtDistance = shipInfo.protectingDistance;
                }
                break;
            default:
                // Define a random new target (see how to do something smarter)
                const rigidBody = agent.components.get(CRigidBody.id) as CRigidBody;
                if (rigidBody !== undefined) {
                    this.stopAtDistance = rigidBody.radius;

                    let destX = Math.floor(Math.random() * 1200);
                    let destY = Math.floor(Math.random() * 800);
                    destX = Math.max(rigidBody.radius, Math.min(destX, 1200 - rigidBody.radius));
                    destY = Math.max(rigidBody.radius, Math.min(destY, 800 - rigidBody.radius));
                    this.to = new Vect2D(destX, destY);
                    console.log("Go to random place " + destX + " - " + destY);
                }
        }

        const agentMap = agent.components.get(CMap.id) as CMap;
        this.map = agentMap.grid;

        const result = PathFinding.aStarSearch(this.map, this.from, this.to);
        this.path = PathFinding.reconstructPath(this.map, result.cameFrom, this.from, this.to);

        this.nextPoint = this.path.pop(); //remove current position
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

       // console.log("From: " + from.key() + ", To: " + to.key() + ", " + trajectory.key() + ", heading: " + heading.key() + ", rotation: " + rotationAngleInDegree);

        return new CActionTurn(rotationAngleInDegree);
    }

    public info(): string {
        return "NavTo"
    }
}