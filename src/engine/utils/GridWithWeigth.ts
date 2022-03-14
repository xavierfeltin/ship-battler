import { Vect2D } from "./Vect2D";

export class GridWithWeights {
    private width: number;
    private height: number;
    private weigths: Map<Vect2D, number>;

    public constructor(width: number, height: number, weights?: Map<Vect2D, number>) {
        this.width = width;
        this.height = height;

        this.weigths = new Map();
        if (weights) {
            weights.forEach((weight, position, map) => {
                this.weigths.set(new Vect2D(position.x, position.y), weight);
            })
        }
    }

    public cost(to: Vect2D): number {
        const weight = this.weigths.get(to);
        return weight === undefined ? 0 : weight;
    }

    public isInBounds(location: Vect2D): boolean {
        return location.x >= 0 && location.x < this.width && location.y >= 0 && location.y < this.height;
    }

    public isPassable(location: Vect2D): boolean {
        const cost = this.cost(location);
        return cost === 0;
    }

    public neighbors(location: Vect2D): Vect2D[] {
        const neighbors: Vect2D[] = [
            new Vect2D(location.x + 1, location.y),
            new Vect2D(location.x - 1, location.y),
            new Vect2D(location.x, location.y - 1),
            new Vect2D(location.x, location.y + 1),
            new Vect2D(location.x + 1, location.y - 1),
            new Vect2D(location.x - 1, location.y + 1),
            new Vect2D(location.x - 1, location.y - 1)
        ];

        return neighbors.filter((location) => this.isInBounds(location) && this.isPassable(location));
    }
}