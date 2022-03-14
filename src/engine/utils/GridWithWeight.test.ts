import { GridWithWeights } from "./GridWithWeigth";
import { Vect2D } from "./Vect2D";

test('Creating a 3x3 grid', () => {
    const grid = new GridWithWeights(3, 3);
    expect(grid.size()).toBe(9);
});

test('Getting neighbors of 1,1 in a 3x3 grid', () => {
    const grid = new GridWithWeights(3, 3);
    const current = new Vect2D(1, 1);

    const expectedNeighbors = [
        new Vect2D(0,0),
        new Vect2D(1,0),
        new Vect2D(2,0),
        new Vect2D(2,1),
        new Vect2D(2,2),
        new Vect2D(1,2),
        new Vect2D(0,2),
        new Vect2D(0,1)
    ];
    const neighbors = grid.neighbors(current);
    expect(neighbors.length).toBe(8);

    neighbors.forEach((neighbor) => {
        const index = expectedNeighbors.findIndex((val) => val.x === neighbor.x && val.y === neighbor.y);
        expect(index).toBeGreaterThan(-1);
    })
});

test('Filter out of boundaries neighbors of a 0,0 in a 3x3 grid', () => {
    const grid = new GridWithWeights(3, 3);
    const current = new Vect2D(0, 0);

    const expectedNeighbors = [
        new Vect2D(1,0),
        new Vect2D(1,1),
        new Vect2D(0,1)
    ];
    const neighbors = grid.neighbors(current);
    expect(neighbors.length).toBe(3);

    neighbors.forEach((neighbor) => {
        const index = expectedNeighbors.findIndex((val) => val.x === neighbor.x && val.y === neighbor.y);
        expect(index).toBeGreaterThan(-1);
    })
});

test('Filter out unpassable nodes in a 3x3 grid', () => {
    const unpassableNodes = new Map<string, number>();
    unpassableNodes.set("1-0", 1);
    unpassableNodes.set("2-0", 1);
    const grid = new GridWithWeights(3, 3, unpassableNodes);

    const current = new Vect2D(1, 1);

    const expectedNeighbors = [
        new Vect2D(0,0),
        new Vect2D(2,1),
        new Vect2D(2,2),
        new Vect2D(1,2),
        new Vect2D(0,2),
        new Vect2D(0,1)
    ];
    const neighbors = grid.neighbors(current);
    expect(neighbors.length).toBe(6);

    neighbors.forEach((neighbor) => {
        const index = expectedNeighbors.findIndex((val) => val.x === neighbor.x && val.y === neighbor.y);
        expect(index).toBeGreaterThan(-1);
    })
});