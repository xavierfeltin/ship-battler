import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CCanvas } from '../components/CCanvas';
import { CActionMine } from '../components/CActionMine';
import { IEntity } from '../IEntity';
import { CLife } from '../components/CLife';
import { CMiningBeam } from '../components/CMiningBeam';
import { GameEnityUniqId } from '../../GameEngine';

export interface MinedAsteroid {
    asteroidId: string;
    asteroid: IEntity;
    miningShips: IEntity[];
}
export class SMine implements ISystem {
    public id = 'Mine';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([CActionMine.id]);
        const canvas = ecs.selectEntityFromId(GameEnityUniqId.Canvas);

        if (!canvas) {
            return;
        }

        // Register which asteroids are updated
        const minedAsteroids: MinedAsteroid[] = [];
        for (let ship of entities) {
            const mine = ship.components.get(CActionMine.id) as CActionMine;
            const asteroid =  ecs.selectEntityFromId(mine.asteroidId);
            if (asteroid !== undefined) {
                const minedAsteroid: MinedAsteroid | undefined = minedAsteroids.find((a: MinedAsteroid) => {
                    return a.asteroidId === mine.asteroidId;
                });

                if (minedAsteroid === undefined) {
                    minedAsteroids.push({
                        asteroidId: mine.asteroidId,
                        asteroid: asteroid,
                        miningShips: [ship]
                    });
                }
                else {
                    minedAsteroid.miningShips.push(ship);
                }
            }
        }

        for (let minedAsteroid of minedAsteroids) {
            // Update the life of the mined asteroid in one go
            const isAsteroidBeingMined = this.mineAsteroid(minedAsteroid.asteroid, minedAsteroid.miningShips.length, ecs)
            if (!isAsteroidBeingMined) {
                ecs.removeEntity(minedAsteroid.asteroid.name);
            }

            // Update the associated ships depending of the resulting asteroid state
            for (let ship of minedAsteroid.miningShips) {
                const mine = ship.components.get(CActionMine.id) as CActionMine;
                if (isAsteroidBeingMined) {
                    //this.stopShipForMining(ship, ecs);
                    this.addMiningBeam(ship, mine, ecs, canvas.components.get(CCanvas.id) as CCanvas);
                }
                else {
                    //this.restartShipAfterMining(ship, ecs);
                    ecs.removeComponentOnEntity(ship, mine);
                    const miningBeam = ship.components.get(CMiningBeam.id) as CMiningBeam;
                    ecs.removeComponentOnEntity(ship, miningBeam);
                }
            }
        }
    }

    /*
    private stopShipForMining(ship: IEntity, ecs: ECSManager): void {
        const speed = ship.components.get(CSpeed.id) as CSpeed;
        speed.stop();
        ecs.addOrUpdateComponentOnEntity(ship, speed);
    }

    private restartShipAfterMining(ship: IEntity, ecs: ECSManager): void {
        const speed = ship.components.get(CSpeed.id) as CSpeed;
        speed.go();
        ecs.addOrUpdateComponentOnEntity(ship, speed);
    }
    */

    private mineAsteroid(asteroid: IEntity, nbMiningShips: number, ecs: ECSManager): boolean {
        let life: CLife = asteroid.components.get(CLife.id) as CLife;
        if (life !== undefined) {
            life.value = life.value - nbMiningShips;
            ecs.addOrUpdateComponentOnEntity(asteroid, life);
            const isAsteroidBeingMined = life.value > 0;
            return isAsteroidBeingMined;
        }

        const isAsteroidBeingMined = false;
        return isAsteroidBeingMined;
    }

    private addMiningBeam(ship: IEntity, mineAction: CActionMine, ecs: ECSManager, canvas: CCanvas) {
        const heading = mineAction.heading;
        const target = mineAction.target;

        let miningBeam: CMiningBeam = new CMiningBeam(target, heading);
        ecs.addOrUpdateComponentOnEntity(ship, miningBeam);
    }
}