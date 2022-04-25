import { Tree } from "./Tree";

interface TestObj {
    id: number;
}

test('Creating an empty tree', () => {
    const t = new Tree<TestObj>();
    expect(t.getTree().length).toBe(0);
});

test('Creating a tree with a root', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);
    expect(t.getTree().length).toBe(1);
});

test('Getting first node at root level', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);
    const root = t.getFirstChildFromNode(undefined);
    expect(root?.object.id).toBe(1);
    expect(root?.leftSibling).toBeUndefined();
    expect(root?.parent).toBeUndefined();
});

test('Add a node', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj: TestObj = {
        id: 2
    };
    const addedNodes = t.addToNode([nodeObj], t.getFirstChildFromNode(undefined));
    expect(t.getTree().length).toBe(1);
    expect(addedNodes.length).toBe(1);
    expect(addedNodes[0]?.object?.id).toBe(2);
    expect(addedNodes[0]?.children?.length).toBe(0);
    expect(addedNodes[0]?.leftSibling).toBe(undefined);
    expect(addedNodes[0]?.parent?.object.id).toBe(1);
});

test('Add several nodes', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj1: TestObj = {
        id: 2
    };

    const nodeObj2: TestObj = {
        id: 3
    };

    const addedNodes = t.addToNode([nodeObj1, nodeObj2], t.getFirstChildFromNode(undefined));
    expect(t.getTree().length).toBe(1);
    expect(addedNodes.length).toBe(2);
    expect(addedNodes[0]?.object?.id).toBe(2);
    expect(addedNodes[0]?.children?.length).toBe(0);
    expect(addedNodes[0]?.leftSibling).toBeUndefined();
    expect(addedNodes[0]?.parent?.object?.id).toBe(1);

    expect(addedNodes[1]?.object?.id).toBe(3);
    expect(addedNodes[1]?.children?.length).toBe(0);
    expect(addedNodes[1]?.leftSibling?.object?.id).toBe(nodeObj1.id);
    expect(addedNodes[1]?.parent?.object?.id).toBe(1);
});

test('Getting first child of a node', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj1: TestObj = {
        id: 2
    };

    const nodeObj2: TestObj = {
        id: 3
    };

    const addedNodes = t.addToNode([nodeObj1, nodeObj2], t.getFirstChildFromNode(undefined));
    const rootNode = t.getFirstChildFromNode(undefined);
    const firstChild = t.getFirstChildFromNode(rootNode);
    expect(firstChild?.object?.id).toBe(addedNodes[0]?.object?.id);
});

test('Remove node', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj1: TestObj = {
        id: 2
    };

    const nodeObj2: TestObj = {
        id: 3
    };

    t.addToNode([nodeObj1, nodeObj2], t.getFirstChildFromNode(undefined));
    const rootNode = t.getFirstChildFromNode(undefined);
    let firstChild = t.getFirstChildFromNode(rootNode);
    const parentNode = t.removeNode(firstChild);

    expect(parentNode?.object?.id).toBe(rootNode?.object?.id);
    firstChild = t.getFirstChildFromNode(parentNode);
    expect(firstChild?.object?.id).toBe(nodeObj2.id);
    expect(firstChild?.leftSibling).toBeUndefined();
    expect(parentNode?.children.length).toBe(1);
});

test('Pop front child', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj1: TestObj = {
        id: 2
    };

    const nodeObj2: TestObj = {
        id: 3
    };

    t.addToNode([nodeObj1, nodeObj2], t.getFirstChildFromNode(undefined));
    const rootNode = t.getFirstChildFromNode(undefined);
    const poppedChild = t.popFrontChildFromNode(rootNode);

    expect(poppedChild?.object.id).toBe(nodeObj1.id);
    expect(rootNode?.children.length).toBe(1);
    const firstChild = t.getFirstChildFromNode(rootNode);
    expect(firstChild?.object.id).toBe(nodeObj2.id);
    expect(firstChild?.leftSibling).toBeUndefined();
});

test('Pop front child without having child', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const rootNode = t.getFirstChildFromNode(undefined);
    const poppedChild = t.popFrontChildFromNode(rootNode);
    expect(poppedChild).toBeUndefined();
});

test('Get left sibling', () => {
    const rootObj: TestObj = {
        id: 1
    };
    const t = new Tree<TestObj>(rootObj);

    const nodeObj1: TestObj = {
        id: 2
    };

    const nodeObj2: TestObj = {
        id: 3
    };

    const addedNodes = t.addToNode([nodeObj1, nodeObj2], t.getFirstChildFromNode(undefined));
    let leftSibling = t.getFirstLeftSibling(addedNodes[1]);
    expect(leftSibling?.object.id).toBe(2);

    leftSibling = t.getFirstLeftSibling(addedNodes[0]);
    expect(leftSibling).toBeUndefined();
});
