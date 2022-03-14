import { GridWithWeights } from "./GridWithWeigth";
import { PathFinding } from "./Pathfinding";
import { Vect2D } from "./Vect2D";

test('Evaluate the manhattan distance', () => {
    const a = new Vect2D(3, 5);
    const b = new Vect2D(10, 12);
    expect(PathFinding.manhattanDistance(a, b)).toBe(14);
});

test('Find path of two points in a line', () => {
    const from = new Vect2D(1, 1);
    const to = new Vect2D(1, 6);
    const grid = new GridWithWeights(10, 10);

    const result = PathFinding.aStarSearch(grid, from, to);
    const path = PathFinding.reconstructPath(result.cameFrom, from, to);

    expect(path.length).toBe(6);
});