import { GridWithWeights } from "./GridWithWeigth";
import { PathFinding } from "./Pathfinding";
import { Vect2D } from "./Vect2D";

test('Evaluate the manhattan distance', () => {
    const a = new Vect2D(3, 5);
    const b = new Vect2D(10, 12);
    expect(PathFinding.manhattanDistance(a, b)).toBe(14);
});

test('Find path of two points on a vertical line', () => {
    const from = new Vect2D(1, 1);
    const to = new Vect2D(1, 6);
    const grid = new GridWithWeights(10, 10, 1);

    const result = PathFinding.aStarSearch(grid, from, to);
    const path = PathFinding.reconstructPath(result.cameFrom, from, to);

    expect(path.length).toBe(6);
    expect(path[0].key()).toBe("1-1");
    expect(path[1].key()).toBe("1-2");
    expect(path[2].key()).toBe("1-3");
    expect(path[3].key()).toBe("1-4");
    expect(path[4].key()).toBe("1-5");
    expect(path[5].key()).toBe("1-6");
});

test('Find path of two points on a diagonal', () => {
    const from = new Vect2D(1, 1);
    const to = new Vect2D(6, 6);
    const grid = new GridWithWeights(10, 10, 1);

    const result = PathFinding.aStarSearch(grid, from, to);
    const path = PathFinding.reconstructPath(result.cameFrom, from, to, true);

    expect(path.length).toBe(6);
    expect(path[0].key()).toBe("1-1");
    expect(path[1].key()).toBe("2-2");
    expect(path[2].key()).toBe("3-3");
    expect(path[3].key()).toBe("4-4");
    expect(path[4].key()).toBe("5-5");
    expect(path[5].key()).toBe("6-6");
});

test('Find path of two points on a vertical line with an obstacle', () => {
    const from = new Vect2D(1, 1);
    const to = new Vect2D(1, 6);
    const weights = new Map<string, number>();
    weights.set("0-3", -1);
    weights.set("1-3", -1);
    weights.set("2-3", -1);
    const grid = new GridWithWeights(10, 10, 1, weights);

    const result = PathFinding.aStarSearch(grid, from, to);
    const path = PathFinding.reconstructPath(result.cameFrom, from, to, true);

    expect(path.length).toBe(6);
    expect(path[0].key()).toBe("1-1");
    expect(path[1].key()).toBe("2-2");
    expect(path[2].key()).toBe("3-3");
    expect(path[3].key()).toBe("2-4");
    expect(path[4].key()).toBe("1-5");
    expect(path[5].key()).toBe("1-6");
});