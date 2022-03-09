import { BinaryTree, IBTNode } from "./BinaryTree";

test('Creating an empty binary tree', () => {
    const bt = new BinaryTree();
    expect(bt.getBT().length).toBe(0);
});

test('Creating a binary tree with a root', () => {
    const rootNode: IBTNode = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    expect(bt.getBT().length).toBe(1);
});

test('Compute next left and right index', () => {
    const rootNode: IBTNode = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    expect(bt.nextLeftSideIndex(0)).toBe(1);
    expect(bt.nextRightSideIndex(0)).toBe(2);

    expect(bt.nextLeftSideIndex(5)).toBe(11);
    expect(bt.nextRightSideIndex(5)).toBe(12);
});

test('Set left node', () => {
    const rootNode: IBTNode = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    bt.setLeft({value: 50, object: 50}, 0);
    const btArray = bt.getBT();
    expect(bt.getBT().length).toBe(2);
    expect(btArray[0].value).toBe(100);
    expect(btArray[1].value).toBe(50);
});

test('Set right node', () => {
    const rootNode: IBTNode = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    bt.setRight({value: 150, object: 150}, 0);
    const btArray = bt.getBT();
    expect(bt.getBT().length).toBe(3);
    expect(btArray[0].value).toBe(100);
    expect(btArray[1]).toBe(null);
    expect(btArray[2].value).toBe(150);
});

test('Find root index with only a root', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    expect(bt.getBT().length).toBe(1);
    expect(bt.findRoot({value: 50, object: 50})).toBe(0);
});

test('Find root index to insert a big value with already a small value present', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    expect(bt.getBT().length).toBe(2);
    expect(bt.findRoot({value: 150, object: 150})).toBe(0);
});

test('Find root index to insert a small value with already a big value present', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 150, object: 150});
    expect(bt.findRoot({value: 50, object: 50})).toBe(0);
});

test('Find root index by adding 125 to [100, 50, 150]', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});
    expect(bt.findRoot({value: 125, object: 125})).toBe(2);
});

test('Find root index by adding 110 to [100, 50, 150, 125, 200]', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});
    bt.addNode({value: 125, object: 125});
    bt.addNode({value: 200, object: 200});
    expect(bt.findRoot({value: 110, object: 110})).toBe(5);
});

test('Creating a simple binary tree with one level', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});

    const btArray = bt.getBT();
    expect(btArray.length).toBe(3);
    expect(btArray[0].value).toBe(100);
    expect(btArray[1].value).toBe(50);
    expect(btArray[2].value).toBe(150);
});

test('Creating a simple unbalanced binary tree with three levels', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});
    bt.addNode({value: 125, object: 125});
    bt.addNode({value: 200, object: 200});
    bt.addNode({value: 110, object: 110});
    bt.addNode({value: 105, object: 105});
    bt.addNode({value: 20, object: 20});

    const btArray = bt.getBT();
    expect(btArray.length).toBe(24);
    expect(btArray[0].value).toBe(100);
    expect(btArray[1].value).toBe(50);
    expect(btArray[2].value).toBe(150);
    expect(btArray[3].value).toBe(20);
    expect(btArray[4]).toBe(null);
    expect(btArray[5].value).toBe(125);
    expect(btArray[6].value).toBe(200);
    for (let i = 7; i <= 10; i++) {
        expect(btArray[i]).toBe(null);
    }
    expect(btArray[11].value).toBe(110);
    for (let i = 11; i <= 22; i++) {
        expect(btArray[i]).toBe(null);
    }
    expect(btArray[23].value).toBe(105);
});