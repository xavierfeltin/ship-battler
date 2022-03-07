import { COrientation } from "./ecs/components/COrientation";
import { CPosition } from "./ecs/components/CPosition";
import { CRenderer } from "./ecs/components/CRenderer";
import { CShip } from "./ecs/components/CShip";
import { CVelocity } from "./ecs/components/CVelocity";
import { ECSManager } from "./ecs/ECSManager";
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

export class GameEngine {
    private ecs: ECSManager;
    private ctx: CanvasRenderingContext2D;
    private cacheSystemsByPriority: ISystem[];

    public constructor(canvas: CanvasRenderingContext2D) {
        this.ecs = new ECSManager();
        this.ctx = canvas;
        this.cacheSystemsByPriority = [];
    }

    public init() {
        this.addArea();
        this.addTimeFrame();
        this.addShip();

        this.addBot();
        this.addPhysics();
        this.addRendering();
        this.cacheSystemsByPriority = this.ecs.getSystemListByPriority();
    }

    public update() {
        this.cacheSystemsByPriority.forEach(system => {
            system.onUpdate(this.ecs);
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

    private addShip() {
        let components = new Map<string, IComponent>();
        components.set(CShip.id, new CShip());
        components.set(CPlanner.id, new CPlanner());
        components.set(CSpeed.id, new CSpeed(5));
        components.set(CPosition.id, new CPosition(new Vect2D(200, 200)));
        components.set(COrientation.id, new COrientation(35));
        components.set(CVelocity.id, new CVelocity(new Vect2D(0, 0)));
        components.set(CRenderer.id, new CRenderer({
            width: 40,
            height: 40,
            sprite: ShipResources.GetSpriteBase64(),
            ctx: this.ctx
        }));
        this.ecs.addEntity(components);
    }

    private addBot() {
        this.ecs.addSystem("Planify", new SPlanify(0));
    }

    private addPhysics() {
        this.ecs.addSystem("Orientate", new SOrientate(1));
        this.ecs.addSystem("Move", new SMove(2));
    }

    private addRendering() {
        this.ecs.addSystem("RenderArea", new SRenderArea(3));
        this.ecs.addSystem("RenderShip", new SRenderShip(4));
    }
}