import { IComponent } from "./IComponent";
import { IEntity } from "./IEntity";
import { ISystem } from "./ISystem";

export class ECSManager {
    private entities: Map<string, IEntity>;
    private systems: Map<string, ISystem>;

    private lastId: number;

    public constructor() {
        this.entities = new Map();
        this.systems = new Map();
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
        entity.components.set(component.name, component);
    }

    public addSystem(name: string, system: ISystem) {
        this.systems.set(name, system);
    }

    public removeSystem(name: string) {
        this.systems.delete(name);
    }

    public getSystemListByPriority(): ISystem[] {
        const sortByPriority = function(a: [string, ISystem], b: [string, ISystem]): number {
            return (a[1].priority - b[1].priority);
        }
        return Array.from(this.systems.entries()).sort(sortByPriority).map((value: [string, ISystem]) => {return value[1]});
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