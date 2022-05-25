import { Vect2D } from "../../utils/Vect2D";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { CRigidBody } from "../../ecs/components/CRigidBody";
import { IAActionState } from "../IAIAction";
import { Task } from "./Task";
import { WorldState } from "../WorldState";
import { CShipSensor } from "../../ecs/components/CShipSensor";
import { CAsteroidSensor } from "../../ecs/components/CAsteroidSensor";
import { CShip } from "../../ecs/components/CShip";
import { CNavigation } from "../../ecs/components/CNavigation";

export enum NAVMODE {
    AGRESSIVE,
    MINING,
    PROTECTING,
    INTERCEPTING,
    RANDOM
};
export class TNavigateTo<T extends {isMoving: number; isInRange: number; isTargetHasMoved: number}> extends Task<T> {
    public static id: string = "GoTo";
    public id: string = TNavigateTo.id;

    private navMode: NAVMODE;

    public constructor(indexes: T, mode: NAVMODE) {
        super(indexes);
        this.navMode = mode;
    }

    public canBeRun(worldState: WorldState): boolean {
        // For now always can navigate to some place even if already on movement
        const isTargetHasMoved: boolean = worldState.getState(this.indexes.isTargetHasMoved) === 0;
        return isTargetHasMoved;
    }

    public applyEffects(worldState: WorldState): WorldState {
        worldState.changeState(this.indexes.isMoving, 1); // When the flag is reset to 0 ???
        worldState.changeState(this.indexes.isInRange, 1); // At the end we suppose to be in range of the target
        return worldState;
    }

    public operate(agent: IEntity): IComponent[] {
        let navAction: CNavigation | undefined = agent.components.get(CNavigation.id) as CNavigation;
        if (navAction !== undefined && !navAction.isNavigationOver()) {
            console.log("[NavigateTo] navigation action is underway");
            return [navAction];
        }
        else if (navAction === undefined && this.state === IAActionState.ONGOING) {
            console.log("[NavigateTo] final destination has been reached");
            this.state = IAActionState.DONE;
            return [];
        }
        else {
            console.log("[NavigateTo] start a new navigation");
            this.state = IAActionState.ONGOING;
            const destination = this.selectDestination(agent);
            navAction = new CNavigation(destination.to, destination.stopAtDistance);
            return [navAction];
        }
    }

    private selectDestination(agent: IEntity): {to: Vect2D, stopAtDistance: number} {
        let destination = {
            to: new Vect2D(-1,-1),
            stopAtDistance: 0
        };

        const shipInfo: CShip = agent.components.get(CShip.id) as CShip;
        const shipSensor: CShipSensor = agent.components.get(CShipSensor.id) as CShipSensor;
        const asteroidSensor: CAsteroidSensor = agent.components.get(CAsteroidSensor.id) as CAsteroidSensor;
        switch(this.navMode) {
            case NAVMODE.AGRESSIVE:
                if (shipSensor !== undefined && shipSensor.mainDetectedPos !== undefined) {
                    destination.to = shipSensor.mainDetectedPos;
                    console.log("Follow ship target " + shipSensor.mainDetectedShipId);

                    if (shipInfo !== undefined) {
                        destination.stopAtDistance = shipInfo.shootingDistance;
                    }
                }
                break;
            case NAVMODE.MINING:
                if (asteroidSensor !== undefined && asteroidSensor.detectedPos !== undefined) {
                    destination.to = asteroidSensor.detectedPos;
                    console.log("Follow asteroid target " + asteroidSensor.detectedAsteroidId);

                    if (shipInfo !== undefined) {
                        destination.stopAtDistance = shipInfo.miningDistance;
                    }
                }
                break;
            case NAVMODE.PROTECTING:
                if (shipSensor !== undefined && shipSensor.mainDetectedPos !== undefined) {
                    destination.to = shipSensor.mainDetectedPos;
                    console.log("Follow ship to protect " + shipSensor.mainDetectedShipId);

                    if (shipInfo !== undefined) {
                        destination.stopAtDistance = shipInfo.protectingDistance;
                    }
                }
                break;
            case NAVMODE.INTERCEPTING:
                if (shipSensor !== undefined && shipSensor.mainDetectedPos !== undefined && shipSensor.secondaryDetectedPos !== undefined) {
                    const agressionVector = Vect2D.sub(shipSensor.secondaryDetectedPos, shipSensor.mainDetectedPos);
                    agressionVector.normalize();
                    agressionVector.mul(shipInfo.protectingDistance);
                    const interceptionPoint = Vect2D.add(shipSensor.mainDetectedPos, agressionVector);
                    destination.to = interceptionPoint;
                    console.log("Intercept menace " + shipSensor.secondaryDetectedShipId + " at " + interceptionPoint.key());

                    const rigidBody = agent.components.get(CRigidBody.id) as CRigidBody;
                    if (rigidBody !== undefined) {
                        destination.stopAtDistance = rigidBody.radius;
                    }
                }
                break;
            default:
                // Define a random new target (see how to do something smarter)
                const rigidBody = agent.components.get(CRigidBody.id) as CRigidBody;
                if (rigidBody !== undefined) {
                    let destX = Math.floor(Math.random() * 1200);
                    let destY = Math.floor(Math.random() * 800);
                    destX = Math.max(rigidBody.radius, Math.min(destX, 1200 - rigidBody.radius));
                    destY = Math.max(rigidBody.radius, Math.min(destY, 800 - rigidBody.radius));
                    destination.to = new Vect2D(destX, destY);
                    destination.stopAtDistance = rigidBody.radius;
                    console.log("Go to random place " + destX + " - " + destY);
                }
        }
        return destination;
    }

    public info(): string {
        return "NavTo"
    }
}