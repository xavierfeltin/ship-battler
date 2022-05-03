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
        const mining = agent.components.get(CActionMine.id) as CActionMine;

        // Start mining the new asteroid detected
        if (this.minedAsteroidID === "") {
            const asteroidSensor: CAsteroidSensor = agent.components.get(CAsteroidSensor.id) as CAsteroidSensor;
            if (asteroidSensor && asteroidSensor.detectedPos) {
                const target = asteroidSensor.detectedPos;
                const pos = agent.components.get(CPosition.id) as CPosition;

                const heading = Vect2D.sub(target, pos.value);
                heading.normalize();

                this.state = IAActionState.ONGOING;
                return new CActionMine(new Vect2D(pos.value.x, pos.value.y), heading, target, asteroidSensor.detectedAsteroidId);
            }
        }
        else if (mining !== undefined) {
            //keep mining current asteroid
            return mining;
        }
        // else no asteroid to mine

        this.minedAsteroidID = "";
        this.state = IAActionState.DONE;
        return undefined;
    }

    public info(): string {
        return "MineAt"
    }
}