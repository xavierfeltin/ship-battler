import path from "path";
import { GridWithWeights } from "./GridWithWeigth";
import { PriorityQueue } from "./PriorityQueue";
import { Vect2D } from "./Vect2D";

export class PathFinding {
    public static manhattanDistance(a: Vect2D, b: Vect2D) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // A* from https://www.redblobgames.com/pathfinding/a-star/implementation.html
    public static aStarSearch(graph: GridWithWeights, start: Vect2D, target: Vect2D): {cameFrom: Map<string, Vect2D | undefined>, costSoFar: Map<string, number>} {
        let toVisit = new PriorityQueue<Vect2D>();
        toVisit.push(0, start);

        let cameFrom = new Map<string, Vect2D | undefined>();
        let costSoFar = new Map<string, number>();

        while (!toVisit.empty()) {
            const current: Vect2D | undefined = toVisit.pop();

            // woopsie not defined... try the next one
            if (current === undefined) {
                console.warn("[aStarSearch] The location is not defined");
                continue;
            }

            // Found our target \o/ !
            if (current !== undefined && current.eq(target)) {
                break;
            }

            let neighbors = graph.neighbors(current);
            neighbors.forEach((next) => {
                let costSoFarForCurrent = costSoFar.get(current.key());
                const currentCostSoFar = costSoFarForCurrent === undefined ? 0 : costSoFarForCurrent;

                let costSoFarForNext = costSoFar.get(next.key());
                const nextCostSoFar = costSoFarForNext === undefined ? 0 : costSoFarForNext;

                const newCost = currentCostSoFar + graph.cost(next);
                if (!costSoFar.has(next.key()) || newCost < nextCostSoFar) {
                    costSoFar.set(next.key(), newCost);

                    // Visit first the path we supposed the less costly
                    const priority = newCost + this.manhattanDistance(next, target);
                    toVisit.push(priority, next);
                    cameFrom.set(next.key(), current);
                }
            })
        }

        return {
            cameFrom: cameFrom,
            costSoFar: costSoFar
        };
    }

    public static reconstructPath(cameFrom: Map<string, Vect2D | undefined>, start: Vect2D, target: Vect2D): Vect2D[] {
        let current = target;
        const path: Vect2D[] = [];
        const startKey = start.key();

        while (current.key() !== startKey) {
            path.push(current);
            const cur = cameFrom.get(current.key());
            if (cur !== undefined) {
                current = cur;
            }
            else {
                console.warn("A step in the path being reconstructed is undefined. The path may not be fully correct.");
            }
        }
        path.push(start);
        return path.reverse();
    }
}