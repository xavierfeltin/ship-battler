import { GridWithWeights } from "./GridWithWeigth";
import { PriorityQueue } from "./PriorityQueue";
import { Vect2D } from "./Vect2D";

export class PathFinding {
    public static manhattanDistance(a: Vect2D, b: Vect2D) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // A* from https://www.redblobgames.com/pathfinding/a-star/implementation.html
    public static aStarSearch(graph: GridWithWeights, start: Vect2D, target: Vect2D): {cameFrom: Map<Vect2D, Vect2D | undefined>, costSoFar: Map<Vect2D, number>} {
        let toVisit = new PriorityQueue<Vect2D>();
        toVisit.push(0, start);

        let cameFrom = new Map<Vect2D, Vect2D | undefined>();
        let costSoFar = new Map<Vect2D, number>();

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
                let costSoFarForCurrent = costSoFar.get(current);
                const currentCostSoFar = costSoFarForCurrent === undefined ? 0 : costSoFarForCurrent;

                let costSoFarForNext = costSoFar.get(next);
                const nextCostSoFar = costSoFarForNext === undefined ? 0 : costSoFarForNext;

                const newCost = currentCostSoFar + graph.cost(next);
                if (!costSoFar.has(next) || newCost < nextCostSoFar) {
                    costSoFar.set(next, newCost);

                    // Visit first the path we supposed the less costly
                    const priority = newCost + this.manhattanDistance(next, target);
                    toVisit.push(priority, next);
                    cameFrom.set(next, current);
                }
            })
        }

        return {
            cameFrom: cameFrom,
            costSoFar: costSoFar
        };
    }
}