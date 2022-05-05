import { CActionMine } from "../../ecs/components/CActionMine";
import { CAsteroidSensor } from "../../ecs/components/CAsteroidSensor";
import { CPosition } from "../../ecs/components/CPosition";
import { IComponent } from "../../ecs/IComponent";
import { IEntity } from "../../ecs/IEntity";
import { Vect2D } from "../../utils/Vect2D";
import { IAActionState } from "../IAIAction";
import { WorldState } from "../WorldState";
import { Task } from "./Task";

export class TMineAt<T extends {isInRange: number;  hasAsteroidToMine: number; isMining: number;}> extends Task<T> {
    private minedAsteroidID: string;

    public constructor(indexes: T) {
        super(indexes);
        this.minedAsteroidID = "";
    }

    public canBeRun(worldState: WorldState): boolean {
        const hasAsteroidToMine: boolean = worldState.getState(this.indexes.hasAsteroidToMine) === 1;
        const isInMiningRange = worldState.getState(this.indexes.isInRange) === 1;
        return hasAsteroidToMine && isInMiningRange;
    }

    public applyEffects(worldState: WorldState): WorldState {
        worldState.changeState(this.indexes.isMining, 1);
        return worldState;
    }

    public operate(agent: IEntity): IComponent | undefined {
        let miningAction: CActionMine | undefined = agent.components.get(CActionMine.id) as CActionMine;
        if (miningAction !== undefined) {
            console.log("[MineAT] mining action is underway");
            //keep mining current asteroid
            return miningAction;
        }

        if (this.minedAsteroidID === "") {
            // Start mining a new asteroid if detected
            const asteroidSensor: CAsteroidSensor = agent.components.get(CAsteroidSensor.id) as CAsteroidSensor;
            if (asteroidSensor && asteroidSensor.detectedPos !== undefined) {
                console.log("[MineAT] start mining a new asteroid " + asteroidSensor.detectedAsteroidId);
                this.minedAsteroidID = asteroidSensor.detectedAsteroidId;
                const target = asteroidSensor.detectedPos;
                const pos = agent.components.get(CPosition.id) as CPosition;

                const heading = Vect2D.sub(target, pos.value);
                heading.normalize();

                this.state = IAActionState.ONGOING;
                miningAction = new CActionMine(new Vect2D(pos.value.x, pos.value.y), heading, target, asteroidSensor.detectedAsteroidId);
            }
            else {
                // no asteroid to mine
                console.log("[MineAT] no asteroid to mine");
                miningAction = undefined;
            }
        }
        else {
            // The last mining is over
            console.log("[MineAT] mining of asteroid" + this.minedAsteroidID + " is now done");
            this.minedAsteroidID = "";
            this.state = IAActionState.DONE;
            miningAction = undefined;
        }
        return miningAction;
    }

    public info(): string {
        return "MineAt"
    }
}