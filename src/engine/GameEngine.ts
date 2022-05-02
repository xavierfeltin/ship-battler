import { COrientation } from "./ecs/components/COrientation";
import { CPosition } from "./ecs/components/CPosition";
import { CRenderer } from "./ecs/components/CRenderer";
import { CShip } from "./ecs/components/CShip";
import { CVelocity } from "./ecs/components/CVelocity";
import { ECSManager, ESystems } from "./ecs/ECSManager";
import { Vect2D } from "./utils/Vect2D";
import { ShipResources} from "./resources/RShip";
import { SMove } from "./ecs/systems/SMove";
import { SRenderArea } from "./ecs/systems/SRenderArea";
import { SRenderShip } from "./ecs/systems/SRenderShip";
import { ISystem } from "./ecs/ISystem";
import { IComponent } from "./ecs/IComponent";
import { CTimeFrame } from "./ecs/components/CTimeFrame";
import { CSpeed } from "./ecs/components/CSpeed";
import { SOrientate } from "./ecs/systems/SOrientate";
import { CPlanner } from "./ecs/components/CPlanner";
import { SPlanify } from "./ecs/systems/SPlanify";
import { SBuildMap } from "./ecs/systems/SBuildMap";
import { CRigidBody } from "./ecs/components/CRigidBody";
import { CActionTurn } from "./ecs/components/CActionTurn";
import { CMap } from "./ecs/components/CMap";
import { CDomain } from "./ecs/components/CDomain";
import { ShipDomain } from "./bot/ShipDomain";
import { CShipSensor } from "./ecs/components/CShipSensor";
import { SDetectShip } from "./ecs/systems/SDetectShip";
import { CCanvas } from "./ecs/components/CCanvas";
import { SRenderMissile } from "./ecs/systems/SRenderMissile";
import { SFire } from "./ecs/systems/SFire";
import { SBuildShipDomain } from "./ecs/systems/SBuildShipDomain";
import { AsteroidResources } from "./resources/RAsteroid";
import { CAsteroid } from "./ecs/components/CAsteroid";
import { SRenderAsteroid } from "./ecs/systems/SRenderAsteroid";
import { CLife } from "./ecs/components/CLife";
import { SRenderMiningBeam } from "./ecs/systems/SRenderMiningBeam";
import { SMine } from "./ecs/systems/SMine";
import { SDetectAsteroid } from "./ecs/systems/SDetectAsteroid";
import { CAsteroidSensor } from "./ecs/components/CAsteroidSensor";

export interface ShipConfiguration {
    position: Vect2D;
    speed: number;
    hasShipSensor: boolean;
}

export class GameEngine {
    private ecs: ECSManager;
    private ctx: CanvasRenderingContext2D;
    private cacheSystemsByPriority: {bots: ISystem[], physics: ISystem[], renderers: ISystem[]};

    public constructor(canvas: CanvasRenderingContext2D) {
        this.ecs = new ECSManager();
        this.ctx = canvas;
        this.cacheSystemsByPriority = {bots: [], physics: [], renderers: []};
    }

    public init() {
        this.addCanvas();
        this.addArea();
        this.addTimeFrame();

        this.addShip({
            position: new Vect2D(200, 200),
            hasShipSensor: true,
            speed: 5
        });

        /*
        this.addShip({
            position: new Vect2D(500, 500),
            hasShipSensor: false,
            speed: 6
        });
        */

        this.addAsteroid();

        this.addBot();
        this.addPhysics();
        this.addRendering();
        this.cacheSystemsByPriority.bots = this.ecs.getSystemListByPriority(ESystems.BOT);
        this.cacheSystemsByPriority.physics = this.ecs.getSystemListByPriority(ESystems.PHYSICS);
        this.cacheSystemsByPriority.renderers = this.ecs.getSystemListByPriority(ESystems.RENDERERS);
    }

    public update() {
        this.cacheSystemsByPriority.bots.forEach(system => {
            system.onUpdate(this.ecs);
        });

        this.cacheSystemsByPriority.physics.forEach(system => {
            system.onUpdate(this.ecs);
        });

        this.cacheSystemsByPriority.renderers.forEach(system => {
            system.onUpdate(this.ecs);
        });

        // Clean actions that need to be removed from one update to another
        this.ecs.selectEntitiesFromComponents([]).forEach((entity) => {
            entity.components.delete(CActionTurn.name);
            entity.components.delete(CMap.name);
            entity.components.delete(COrientation.name);
        });
    }

    private addArea() {
        let components = new Map<string, IComponent>();
        components.set(CRenderer.id, new CRenderer({
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height,
            color: "black",
            ctx: this.ctx
        }));
        this.ecs.addUniqEntity('Area', components);
    }

    private addTimeFrame() {
        let components = new Map<string, IComponent>();
        components.set(CTimeFrame.id, new CTimeFrame());
        this.ecs.addUniqEntity('TimeFrame', components);
    }

    private addCanvas() {
        let components = new Map<string, IComponent>();
        components.set(CCanvas.id, new CCanvas(this.ctx));
        this.ecs.addUniqEntity('Canvas', components);
    }

    private addShip(config: ShipConfiguration) {
        let components = new Map<string, IComponent>();
        components.set(CShip.id, new CShip());
        components.set(CDomain.id, new CDomain(new ShipDomain({isMoving: 0, isInRange: 1, hasEnnemyToAttack: 2, hasAsteroidToMine: 3, isMining: 4})));
        components.set(CPlanner.id, new CPlanner<{isMoving: 0, isInRange: 1, hasWeapon: 2}>());
        components.set(CRigidBody.id, new CRigidBody(20));
        components.set(CSpeed.id, new CSpeed(config.speed));
        components.set(CPosition.id, new CPosition(config.position));
        components.set(COrientation.id, new COrientation(0));
        components.set(CVelocity.id, new CVelocity(new Vect2D(0, 0)));
        components.set(CAsteroidSensor.id, new CAsteroidSensor());
        if (config.hasShipSensor)
        {
            components.set(CShipSensor.id, new CShipSensor());
        }
        components.set(CRenderer.id, new CRenderer({
            width: 40,
            height: 40,
            sprite: ShipResources.GetSpriteBase64(),
            ctx: this.ctx
        }));
        this.ecs.addEntity(components);
    }

    private addAsteroid() {
        let components = new Map<string, IComponent>();
        components.set(CAsteroid.id, new CAsteroid());
        components.set(CRigidBody.id, new CRigidBody(20));
        components.set(CPosition.id, new CPosition(new Vect2D(400, 600)));
        components.set(CLife.id, new CLife(100));
        components.set(CRenderer.id, new CRenderer({
            width: 40,
            height: 40,
            sprite: AsteroidResources.GetSpriteBase64(),
            ctx: this.ctx
        }));
        this.ecs.addEntity(components);
    }

    private addBot() {
        this.ecs.addSystem("BuildMap", new SBuildMap(0), ESystems.BOT);
        this.ecs.addSystem("DetectAsteroid", new SDetectAsteroid(1), ESystems.BOT);
        this.ecs.addSystem("DetectShip", new SDetectShip(2), ESystems.BOT);
        this.ecs.addSystem("BuildShipDomain", new SBuildShipDomain(3), ESystems.BOT);
        this.ecs.addSystem("Planify", new SPlanify(4), ESystems.BOT);
    }

    private addPhysics() {
        this.ecs.addSystem("Orientate", new SOrientate(0), ESystems.PHYSICS);
        this.ecs.addSystem("Move", new SMove(1), ESystems.PHYSICS);
        this.ecs.addSystem("Mine", new SMine(2), ESystems.BOT);
        this.ecs.addSystem("Fire", new SFire(3), ESystems.BOT);
    }

    private addRendering() {
        this.ecs.addSystem("RenderArea", new SRenderArea(0), ESystems.RENDERERS);
        this.ecs.addSystem("RenderShip", new SRenderShip(1), ESystems.RENDERERS);
        this.ecs.addSystem("RenderMissile", new SRenderMissile(2), ESystems.RENDERERS);
        this.ecs.addSystem("RenderMiningBeam", new SRenderMiningBeam(2), ESystems.RENDERERS);
        this.ecs.addSystem("RenderAsteroid", new SRenderAsteroid(3), ESystems.RENDERERS);
    }
}