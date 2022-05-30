import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CNavigation } from '../components/CNavigation';
import { CMap } from '../components/CMap';
import { IEntity } from '../IEntity';
import { CPosition } from '../components/CPosition';
import { PathFinding } from '../../utils/Pathfinding';
import { Vect2D } from '../../utils/Vect2D';
import { CSpeed } from '../components/CSpeed';
import { MyMath } from '../../utils/MyMath';
import { COrientation } from '../components/COrientation';
import { CActionTurn } from '../components/CActionTurn';

export class SNavigate implements ISystem {
    public id = 'Navigate';
    public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

    onUpdate(ecs: ECSManager): void {
        const entities = ecs.selectEntitiesFromComponents([CNavigation.id, CMap.id, CPosition.id, COrientation.id, CSpeed.id]);

        for(let entity of entities) {
            this.updatePath(entity, ecs);
            this.navigate(entity, ecs);
        }
    }

    private updatePath(entity: IEntity, ecs: ECSManager): void {
        const map = entity.components.get(CMap.id) as CMap;
        const nav = entity.components.get(CNavigation.id) as CNavigation;
        const from = entity.components.get(CPosition.id) as CPosition;

        if (nav.isNewNavigation()) {
            const path = this.computePath(map, from, nav);
            nav.attachPath(path);
        }

        if (this.isFinalDestinationHasBeenReached(from, nav)) {
            // Avoid issue where destination is too close and cause oscillating effect
            // Force entity to not move
            nav.forceEndOfNavigation();
        }
        else if (this.isWaypointHasBeenReached(from, nav)) {
            nav.goToNextWayPoint();
        }

        ecs.addOrUpdateComponentOnEntity(entity, nav);
    }

    private computePath(map: CMap, from: CPosition, nav: CNavigation): Vect2D[] {
        const result = PathFinding.aStarSearch(map.grid, from.value, nav.destination);
        const path = PathFinding.reconstructPath(map.grid, result.cameFrom, from.value, nav.destination);
        return path;
    }

    private isWaypointHasBeenReached(from: CPosition, nav: CNavigation): boolean {
        return (nav.currentWayPoint === undefined || from.value.distance(nav.currentWayPoint) <= nav.stopAtDistance);
    }

    private isFinalDestinationHasBeenReached(from: CPosition, nav: CNavigation): boolean {
        return from.value.distance(nav.destination) <= nav.stopAtDistance;
    }

    private navigate(entity: IEntity, ecs: ECSManager): void {
        const nav = entity.components.get(CNavigation.id) as CNavigation;
        const from = entity.components.get(CPosition.id) as CPosition;
        const orientation = entity.components.get(COrientation.id) as COrientation;
        const speed =  entity.components.get(CSpeed.id) as CSpeed;

        const navSpeed = new CSpeed(speed.maxValue);
        if (nav.isNavigationOver()) {
            navSpeed.value = 0; // no more waypoint to go to, stop moving
            ecs.addOrUpdateComponentOnEntity(entity, navSpeed);
            ecs.removeComponentOnEntity(entity, nav);
        }
        else {
            const trajectory = nav.currentWayPoint !== undefined ? Vect2D.sub(nav.currentWayPoint, from.value) : new Vect2D(0, 0);
            const rotationAngleInRadian = orientation.heading.angleWithVector(trajectory);
            const rotationAngleInDegree = MyMath.radianToDegree(rotationAngleInRadian);
            const pilotingAction = new CActionTurn(rotationAngleInDegree);

           // console.log("From: " + from.key() + ", To: " + to.key() + ", " + trajectory.key() + ", heading: " + heading.key() + ", rotation: " + rotationAngleInDegree);
           ecs.addOrUpdateComponentOnEntity(entity, navSpeed);
           ecs.addOrUpdateComponentOnEntity(entity, pilotingAction);
        }
    }
}