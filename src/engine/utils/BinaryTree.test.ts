
import { BinaryTree, IBTNode } from "./BinaryTree";

/*
Global btree used for the unit test
                100(0)
		    50(1)		150(2)
		20(3)		125(5)		200(6)
				110(11)
			105(23)
*/

test('Creating an empty binary tree', () => {
    const bt = new BinaryTree();
    expect(bt.getBT().size).toBe(0);
});

test('Creating a binary tree with a root', () => {
    const rootNode: IBTNode<number> = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    expect(bt.getBT().size).toBe(1);
});

test('Compute next left and right index', () => {
    const rootNode: IBTNode<number> = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    expect(bt.nextLeftSideIndex(0)).toBe(1);
    expect(bt.nextRightSideIndex(0)).toBe(2);

    expect(bt.nextLeftSideIndex(5)).toBe(11);
    expect(bt.nextRightSideIndex(6)).toBe(14);
});

test('Compute previous left and right index', () => {
    const rootNode: IBTNode<number> = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    expect(bt.prevLeftSideIndex(0)).toBe(0);
    expect(bt.prevRightSideIndex(0)).toBe(0);

    expect(bt.prevLeftSideIndex(3)).toBe(1);
    expect(bt.prevLeftSideIndex(5)).toBe(2);
    expect(bt.prevRightSideIndex(6)).toBe(2);
    expect(bt.prevLeftSideIndex(23)).toBe(11);
    expect(bt.prevRightSideIndex(14)).toBe(6);
});

test('Set left node', () => {
    const rootNode: IBTNode<number> = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    bt.setLeft({value: 50, object: 50}, 0);
    const btMap = bt.getBT();
    expect(bt.getBT().size).toBe(2);
    expect(btMap.get(0)?.value).toBe(100);
    expect(btMap.get(1)?.value).toBe(50);
});

test('Set right node', () => {
    const rootNode: IBTNode<number> = {value: 100, object: 100};
    const bt = new BinaryTree(rootNode);
    bt.setRight({value: 150, object: 150}, 0);
    const btMap = bt.getBT();
    expect(bt.getBT().size).toBe(2);
    expect(btMap.get(0)?.value).toBe(100);
    expect(btMap.get(1))?.toBe(undefined);
    expect(btMap.get(2)?.value).toBe(150);
});

test('Find root index with only a root', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    expect(bt.getBT().size).toBe(1);
    expect(bt.findRoot({value: 50, object: 50})).toBe(0);
});

test('Find root index to insert a big value with already a small value present', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    expect(bt.getBT().size).toBe(2);
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

    const btMap = bt.getBT();
    expect(btMap.size).toBe(3);
    expect(btMap.get(0)?.value).toBe(100);
    expect(btMap.get(1)?.value).toBe(50);
    expect(btMap.get(2)?.value).toBe(150);
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

    const btMap = bt.getBT();
    expect(btMap.size).toBe(8);
    expect(btMap.get(0)?.value).toBe(100);
    expect(btMap.get(1)?.value).toBe(50);
    expect(btMap.get(2)?.value).toBe(150);
    expect(btMap.get(3)?.value).toBe(20);
    expect(btMap.get(5)?.value).toBe(125);
    expect(btMap.get(6)?.value).toBe(200);
    expect(btMap.get(11)?.value).toBe(110);
    expect(btMap.get(23)?.value).toBe(105);
});

test('Pop min values from tree [100,50,20,150,125,110,105,200]', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});
    bt.addNode({value: 125, object: 125});
    bt.addNode({value: 200, object: 200});
    bt.addNode({value: 110, object: 110});
    bt.addNode({value: 105, object: 105});
    bt.addNode({value: 20, object: 20});

    expect(bt.popMin()?.value).toBe(20);
    expect(bt.getBT().size).toBe(7);
    expect(bt.popMin()?.value).toBe(50);
    expect(bt.getBT().size).toBe(6);
    expect(bt.popMin()?.value).toBe(100);
    expect(bt.getBT().size).toBe(5);
    expect(bt.popMin()?.value).toBe(105);
    expect(bt.getBT().size).toBe(4);
    expect(bt.popMin()?.value).toBe(110);
    expect(bt.getBT().size).toBe(3);
    expect(bt.popMin()?.value).toBe(125);
    expect(bt.getBT().size).toBe(2);
    expect(bt.popMin()?.value).toBe(150);
    expect(bt.getBT().size).toBe(1);
    expect(bt.popMin()?.value).toBe(200);
    expect(bt.getBT().size).toBe(0);
});

test('Pop max values from tree [100,50,20,150,125,110,105,200]', () => {
    const bt = new BinaryTree({value: 100,object: 100});
    bt.addNode({value: 50, object: 50});
    bt.addNode({value: 150, object: 150});
    bt.addNode({value: 125, object: 125});
    bt.addNode({value: 200, object: 200});
    bt.addNode({value: 110, object: 110});
    bt.addNode({value: 105, object: 105});
    bt.addNode({value: 20, object: 20});

    expect(bt.popMax()?.value).toBe(200);
    expect(bt.popMax()?.value).toBe(150);
    expect(bt.popMax()?.value).toBe(125);
    expect(bt.popMax()?.value).toBe(110);
    expect(bt.popMax()?.value).toBe(105);
    expect(bt.popMax()?.value).toBe(100);
    expect(bt.popMax()?.value).toBe(50);
    expect(bt.popMax()?.value).toBe(20);
});
