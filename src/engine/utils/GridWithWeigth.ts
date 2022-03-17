import { Vect2D } from "./Vect2D";

export class GridWithWeights {
    private width: number;
    private height: number;
    private granularity: number;
    private weigths: Map<string, number>;

    public constructor(width: number, height: number, granularity: number, weights?: Map<string, number>) {
        this.width = width;
        this.height = height;
        this.granularity = granularity;

        this.weigths = new Map();
        if (weights) {
            weights.forEach((weight, position, map) => {
                this.weigths.set(position, weight);
            })
        }
    }

    public cost(from: Vect2D, to: Vect2D): number {
        const weight = this.weigths.get(to.key());
        let cost = (weight === undefined) ? 1 : weight;

        // Penalize a bit once the horizontal / vertical path, and the diagonal path in order to straighten the path
        let nudge = 0;
        if ((from.x + from.y) % 2 === 0 && from.x !== to.x)
        {
            nudge = 1;
        }

        if ((from.x + from.y) % 2 === 1 && from.y !== to.y)
        {
            nudge = 1;
        }

        if (from.x !== to.x && from.y !== to.y)
        {
            nudge = 1;
        }

        cost = cost + 0.001 * nudge;
        return cost;
    }

    public isInBounds(location: Vect2D): boolean {
        return location.x >= 0 && location.x < this.width && location.y >= 0 && location.y < this.height;
    }

    public isPassable(from: Vect2D, to: Vect2D): boolean {
        const cost = this.cost(from, to);
        return cost >= 0;
    }

    public neighbors(from: Vect2D): Vect2D[] {
        const neighbors: Vect2D[] = [
            new Vect2D(from.x + this.granularity, from.y),
            new Vect2D(from.x - this.granularity, from.y),
            new Vect2D(from.x, from.y - this.granularity),
            new Vect2D(from.x, from.y + this.granularity),
            new Vect2D(from.x + this.granularity, from.y - this.granularity),
            new Vect2D(from.x - this.granularity, from.y + this.granularity),
            new Vect2D(from.x - this.granularity, from.y - this.granularity),
            new Vect2D(from.x + this.granularity, from.y + this.granularity)
        ];

        return neighbors.filter((to) => this.isInBounds(to) && this.isPassable(from, to));
    }

    public size(): number {
        return this.width * this.height;
    }

    public getClosestNodeFromPosition(pos: Vect2D): Vect2D {
        const remainderX = pos.x % this.granularity;
        const remainderY = pos.y % this.granularity;

        if (remainderX === 0 && remainderY === 0) {
            return pos;
        }

        const candidates: Vect2D[] = [
            new Vect2D(pos.x - remainderX, pos.y - remainderY),
            new Vect2D(pos.x - remainderX + this.granularity, pos.y - remainderY),
            new Vect2D(pos.x - remainderX, pos.y - remainderY + this.granularity),
            new Vect2D(pos.x - remainderX + this.granularity, pos.y - remainderY + this.granularity)
        ];

        let closest = candidates[0];
        let closestDistance = pos.distance2(candidates[0]);
        for(let i = 1; i < candidates.length; i++) {
            if (pos.distance2(candidates[i]) < closestDistance) {
                closest = candidates[i];
            }
        }
        return closest;
    }
}