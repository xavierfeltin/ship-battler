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
import { CCannon } from "./ecs/components/CCannon";
import { SDetectCollisions } from "./ecs/systems/SDetectCollisions";
import { CCollisions } from "./ecs/components/CCollisions";
import { SDamage } from "./ecs/systems/SDamage";
import { SFinalizeFrame } from "./ecs/systems/SFinalizeFrame";
import { SFinalizePhysicsUpdate } from "./ecs/systems/SFinalizePhysicsUpdate";
import { SNavigate } from "./ecs/systems/SNavigate";
import { SBounce } from "./ecs/systems/SBounce";
import { CFieldOfView } from "./ecs/components/CFieldOfView";

export enum GameEnityUniqId {
    Collisions = "collisions",
    PreviousCollisions = "previousCollisions",
    TimeFrame = "timeFrame",
    Area = "area",
    Canvas = "canvas"
}

export enum Team {
    TeamA,
    TeamB
}

export enum ShipRole {
    Mining = "Mining",
    Hunting = "Hunting",
    Blocking = "Blocking"
}

export interface ShipConfiguration {
    position: Vect2D;
    speed: number;
    angleOfView: number;
    depthOfView: number;
    hasShipSensor: boolean;
    hasCannons: boolean;
    hasAsteroidSensor: boolean;
    team: Team;
    role: ShipRole;
}

export interface AsteroidConfiguration {
    position: Vect2D;
}

export class GameEngine {
    private ecs: ECSManager;
    private ctx: CanvasRenderingContext2D;
    private cacheSystemsByPriority: {bots: ISystem[], physics: ISystem[], actions: ISystem[], renderers: ISystem[], postprocessing: ISystem[]};

    public constructor(canvas: CanvasRenderingContext2D) {
        this.ecs = new ECSManager();
        this.ctx = canvas;
        this.cacheSystemsByPriority = {bots: [], physics: [], actions: [], renderers: [], postprocessing: []};
    }

    public init() {
        this.addCanvas();
        this.addArea();
        this.addTimeFrame();
        this.addCollisions()

        this.createTeam(Team.TeamA, this.ecs);
        this.createTeam(Team.TeamB, this.ecs);

        this.createAsteroidField();

        this.addBot();
        this.addPhysics();
        this.addActions();
        this.addRendering();
        this.addPostProcessing();
        this.cacheSystemsByPriority.bots = this.ecs.getSystemListByPriority(ESystems.BOT);
        this.cacheSystemsByPriority.physics = this.ecs.getSystemListByPriority(ESystems.PHYSICS);
        this.cacheSystemsByPriority.actions = this.ecs.getSystemListByPriority(ESystems.ACTIONS);
        this.cacheSystemsByPriority.renderers = this.ecs.getSystemListByPriority(ESystems.RENDERERS);
        this.cacheSystemsByPriority.postprocessing = this.ecs.getSystemListByPriority(ESystems.POSTPROCESSING);
    }

    public update() {
        this.cacheSystemsByPriority.bots.forEach(system => {
            system.onUpdate(this.ecs);
        });

        this.cacheSystemsByPriority.actions.forEach(system => {
            system.onUpdate(this.ecs);
        });

        this.updatePhysicSystems();

        this.cacheSystemsByPriority.renderers.forEach(system => {
            system.onUpdate(this.ecs);
        });

        this.cacheSystemsByPriority.postprocessing.forEach(system => {
            system.onUpdate(this.ecs);
        });
    }

    private updatePhysicSystems(): void {
        const entityTimeFrame = this.ecs.selectEntityFromId(GameEnityUniqId.TimeFrame)
        if (entityTimeFrame === undefined) {
            console.error("[updatePhysicSystems] Time frame entity has not been defined");
            return;
        }
        let timeFrame = entityTimeFrame.components.get(CTimeFrame.id) as CTimeFrame;
        timeFrame.time = 0;
        this.ecs.addOrUpdateComponentOnEntity(entityTimeFrame, timeFrame);

        let t = timeFrame.time;
        let nbSameCollisionTimeDetected = 0;
        while (timeFrame.time < 1.0)
        {
            this.cacheSystemsByPriority.physics.forEach(system => {
                system.onUpdate(this.ecs);
            });

            // Get time when the next collision occurs
            timeFrame = this.ecs.selectEntityFromId(GameEnityUniqId.TimeFrame)?.components.get(CTimeFrame.id) as CTimeFrame;

            // Several collisions could happen at the same moment but it it stuck, force to move forward a bit
            if (timeFrame.time === t) {
                nbSameCollisionTimeDetected ++;
                t = timeFrame.time;
                if (nbSameCollisionTimeDetected > 50) {
                    console.log('collision engine stuck at t = ' + t + ' ignore collision and force moving forward');
                    timeFrame.time += 0.01;
                    t = timeFrame.time;
                    nbSameCollisionTimeDetected = 0;
                }
            }
        }
    }

    private addArea() {
        let components = new Map<string, IComponent>();
        components.set(CRenderer.id, new CRenderer({
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height,
            color: "#0c164f",
            ctx: this.ctx
        }));
        this.ecs.addUniqEntity(GameEnityUniqId.Area, components);
    }

    private addTimeFrame() {
        let components = new Map<string, IComponent>();
        components.set(CTimeFrame.id, new CTimeFrame());
        this.ecs.addUniqEntity(GameEnityUniqId.TimeFrame, components);
    }

    private addCanvas() {
        let components = new Map<string, IComponent>();
        components.set(CCanvas.id, new CCanvas(this.ctx));
        this.ecs.addUniqEntity(GameEnityUniqId.Canvas, components);
    }

    private addCollisions() {
        let components = new Map<string, IComponent>();
        components.set(CCollisions.id, new CCollisions());
        this.ecs.addUniqEntity(GameEnityUniqId.Collisions, components);

        components = new Map<string, IComponent>();
        components.set(CCollisions.id, new CCollisions());
        this.ecs.addUniqEntity(GameEnityUniqId.PreviousCollisions, components);
    }

    private addShip(config: ShipConfiguration) {
        let components = new Map<string, IComponent>();
        components.set(CShip.id, new CShip(100, 400, 100, config.team, config.role));
        components.set(CLife.id, new CLife(30));

        const shipDomainTemplate = {
            isMoving: 0,
            isInRange: 1,
            hasEnnemyToAttack: 2,
            hasAsteroidToMine: 3,
            isMining: 4,
            isReadyToFire: 5,
            hasShipToProtect: 6,
            hasFoundMenaceOnProtectedShip: 7,
            hasTargetMoved: 8
        };
        components.set(CDomain.id, new CDomain(new ShipDomain(shipDomainTemplate)));

        components.set(CPlanner.id, new CPlanner<typeof ShipDomain>());

        switch(config.role) {
            case ShipRole.Hunting:
                components.set(CRigidBody.id, new CRigidBody(22, 10));
                break;
            case ShipRole.Blocking:
                components.set(CRigidBody.id, new CRigidBody(25, 10));
                break;
            case ShipRole.Mining:
                components.set(CRigidBody.id, new CRigidBody(27, 10));
                break;
            default:
                components.set(CRigidBody.id, new CRigidBody(20, 10));
        }

        components.set(CSpeed.id, new CSpeed(config.speed));
        components.set(CPosition.id, new CPosition(config.position));
        components.set(COrientation.id, new COrientation(0));
        components.set(CVelocity.id, new CVelocity(new Vect2D(0, 0)));
        components.set(CFieldOfView.id, new CFieldOfView(config.angleOfView, config.depthOfView));

        if (config.hasAsteroidSensor) {
            components.set(CAsteroidSensor.id, new CAsteroidSensor());
        }

        if (config.hasShipSensor) {
            components.set(CShipSensor.id, new CShipSensor(30));
        }
        if (config.hasCannons) {
            components.set(CCannon.id, new CCannon(15));
        }

        components.set(CRenderer.id, new CRenderer({
            width: 80,
            height: 80,
            sprite: ShipResources.GetSpriteBase64(config.team, config.role),
            spriteRotation: ShipResources.GetSpriteRotation(),
            ctx: this.ctx
        }));
        this.ecs.addEntity(components);
    }

    private createAsteroidField() {
        this.addAsteroid({
            position: new Vect2D(300, 100)
        });

        this.addAsteroid({
            position: new Vect2D(900, 700)
        });

        this.addAsteroid({
            position: new Vect2D(900, 100)
        });

        this.addAsteroid({
            position: new Vect2D(300, 700)
        });

        this.addAsteroid({
            position: new Vect2D(600, 400)
        });

        this.addAsteroid({
            position: new Vect2D(100, 400)
        });

        this.addAsteroid({
            position: new Vect2D(1100, 400)
        });
    }

    private addAsteroid(config: AsteroidConfiguration) {
        let components = new Map<string, IComponent>();
        components.set(CAsteroid.id, new CAsteroid());
        components.set(CRigidBody.id, new CRigidBody(22, 10));
        components.set(CPosition.id, new CPosition(config.position));
        components.set(CLife.id, new CLife(200));
        components.set(CRenderer.id, new CRenderer({
            width: 40,
            height: 40,
            sprite: AsteroidResources.GetSpriteBase64(),
            ctx: this.ctx
        }));
        this.ecs.addEntity(components);
    }

    private createTeam(team: Team, ecs: ECSManager): void {
        const startPositions: Vect2D[] = [];
        if (team === Team.TeamA) {
            startPositions.push(new Vect2D(100, 100));
            startPositions.push(new Vect2D(100, 200));
            startPositions.push(new Vect2D(100, 300));
        }
        else {
            startPositions.push(new Vect2D(1100, 700));
            startPositions.push(new Vect2D(1100, 600));
            startPositions.push(new Vect2D(1100, 500));
        }
        this.createHunter(startPositions[0], team, ecs);
        this.createMiner(startPositions[1], team, ecs);
        this.createBlocker(startPositions[2], team, ecs);
    }

    private createHunter(startPosition: Vect2D, team: Team, ecs: ECSManager): void {
        this.addShip({
            position: startPosition,
            hasShipSensor: true,
            hasCannons: true,
            hasAsteroidSensor: false,
            speed: 4,
            angleOfView: 90,
            depthOfView: 600,
            team: team,
            role: ShipRole.Hunting
        });
    }

    private createMiner(startPosition: Vect2D, team: Team, ecs: ECSManager): void {
        this.addShip({
            position: startPosition,
            hasShipSensor: false,
            hasCannons: false,
            hasAsteroidSensor: true,
            angleOfView: 120,
            depthOfView: 400,
            speed: 4,
            team: team,
            role: ShipRole.Mining
        });
    }

    private createBlocker(startPosition: Vect2D, team: Team, ecs: ECSManager): void {
        this.addShip({
            position: startPosition,
            hasShipSensor: true,
            hasCannons: false,
            hasAsteroidSensor: false,
            speed: 3,
            angleOfView: 360,
            depthOfView: 500,
            team: team,
            role: ShipRole.Blocking
        });
    }

    private addBot() {
        this.ecs.addSystem("BuildMap", new SBuildMap(0), ESystems.BOT);
        this.ecs.addSystem("DetectAsteroid", new SDetectAsteroid(1), ESystems.BOT);
        this.ecs.addSystem("DetectShip", new SDetectShip(2), ESystems.BOT);
        this.ecs.addSystem("BuildShipDomain", new SBuildShipDomain(3), ESystems.BOT);
        this.ecs.addSystem("Planify", new SPlanify(4), ESystems.BOT);
    }

    private addPhysics() {
        this.ecs.addSystem("DetectCollisions", new SDetectCollisions(0), ESystems.PHYSICS);
        this.ecs.addSystem("Orientate", new SOrientate(1), ESystems.PHYSICS);
        this.ecs.addSystem("Move", new SMove(2), ESystems.PHYSICS);
        this.ecs.addSystem("Damage", new SDamage(3), ESystems.PHYSICS);
        this.ecs.addSystem("Bounce", new SBounce(4), ESystems.PHYSICS);
        this.ecs.addSystem("FinalizePhysics", new SFinalizePhysicsUpdate(5), ESystems.PHYSICS);
    }

    private addActions() {
        this.ecs.addSystem("Navigate", new SNavigate(0), ESystems.ACTIONS);
        this.ecs.addSystem("Mine", new SMine(1), ESystems.ACTIONS);
        this.ecs.addSystem("Fire", new SFire(2), ESystems.ACTIONS);
    }

    private addRendering() {
        this.ecs.addSystem("RenderArea", new SRenderArea(0), ESystems.RENDERERS);
        this.ecs.addSystem("RenderShip", new SRenderShip(1), ESystems.RENDERERS);
        this.ecs.addSystem("RenderMissile", new SRenderMissile(2), ESystems.RENDERERS);
        this.ecs.addSystem("RenderMiningBeam", new SRenderMiningBeam(3), ESystems.RENDERERS);
        this.ecs.addSystem("RenderAsteroid", new SRenderAsteroid(4), ESystems.RENDERERS);
    }

    private addPostProcessing() {
        this.ecs.addSystem("FinalizeFrame", new SFinalizeFrame(0), ESystems.POSTPROCESSING);
    }
}