import { IComponent } from "./IComponent";
import { IEntity } from "./IEntity";
import { ISystem } from "./ISystem";

export enum ESystems {
    BOT,
    PHYSICS,
    RENDERERS,
    POSTPROCESSING
}
export class ECSManager {
    private entities: Map<string, IEntity>;
    private botSystems: Map<string, ISystem>;
    private physicsSystems: Map<string, ISystem>;
    private renderersSystems: Map<string, ISystem>;
    private postProcessingSystems: Map<string, ISystem>;

    private lastId: number;

    public constructor() {
        this.entities = new Map();
        this.botSystems = new Map();
        this.physicsSystems = new Map();
        this.renderersSystems = new Map();
        this.postProcessingSystems = new Map();
        this.lastId = 0;
    }

    private nextId(): string {
        return `${++this.lastId}`;
    }

    public addEntity (components: Map<string, IComponent>) {
        const id = this.nextId();
        this.entities.set(id, {
            name: id,
            components: components
        });
    }

    public addUniqEntity(entityId: string, components: Map<string, IComponent>) {
        this.entities.set(entityId, {
            name: entityId,
            components: components
        });
    }

    public removeEntity (name: string) {
        this.entities.delete(name);
    }

    public addOrUpdateComponentOnEntity(entity: IEntity, component: IComponent) {
        entity.components.set(component.id, component);
    }

    public removeComponentOnEntity(entity: IEntity, component: IComponent): void {
        entity.components.delete(component.id);
    }

    public addSystem(name: string, system: ISystem, type: ESystems) {
        switch(type)
        {
            case ESystems.BOT:
                this.botSystems.set(name, system);
                break;
            case ESystems.PHYSICS:
                this.physicsSystems.set(name, system);
                break;
            case ESystems.RENDERERS:
                this.renderersSystems.set(name, system);
                break;
            case ESystems.POSTPROCESSING:
                this.postProcessingSystems.set(name, system);
                break;
            default:
                break;
        }
    }

    public removeSystem(name: string, type: ESystems) {
        switch(type)
        {
            case ESystems.BOT:
                this.botSystems.delete(name);
                break;
            case ESystems.PHYSICS:
                this.physicsSystems.delete(name);
                break;
            case ESystems.RENDERERS:
                this.renderersSystems.delete(name);
                break;
            case ESystems.POSTPROCESSING:
                this.postProcessingSystems.delete(name);
                break;
            default:
                break;
        }
    }

    public getSystemListByPriority(type: ESystems): ISystem[] {
        const sortByPriority = function(a: [string, ISystem], b: [string, ISystem]): number {
            return (a[1].priority - b[1].priority);
        }

        switch(type)
        {
            case ESystems.BOT:
                return Array.from(this.botSystems.entries()).sort(sortByPriority).map((value: [string, ISystem]) => {return value[1]});
            case ESystems.PHYSICS:
                return Array.from(this.physicsSystems.entries()).sort(sortByPriority).map((value: [string, ISystem]) => {return value[1]});
            case ESystems.RENDERERS:
                return Array.from(this.renderersSystems.entries()).sort(sortByPriority).map((value: [string, ISystem]) => {return value[1]});
            case ESystems.POSTPROCESSING:
                return Array.from(this.postProcessingSystems.entries()).sort(sortByPriority).map((value: [string, ISystem]) => {return value[1]});
            default:
                return [];
        }
    }

    public selectEntitiesFromComponents(including: string[], excluding?: string[]): IEntity[] {
        const result: IEntity[] = [];

        this.entities.forEach((entity: IEntity) => {
            const entityComponentsName = Array.from(entity.components.keys());
            if (including.some(k => entityComponentsName.indexOf(k) === -1)) {
                return; // missing at least one required
            }

            if (entityComponentsName.some(component => (excluding ||[]).indexOf(component) !== -1)) {
                return; // at least one forbidden
            }

            result.push(entity);
        });

        return result;
    }

    public selectEntityFromId(entityId: string): IEntity | undefined {
        return this.entities.get(entityId);
    }
}