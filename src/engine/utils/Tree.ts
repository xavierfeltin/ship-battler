export interface ITNode<T>{
    object: T;
    children: ITNode<T>[];
    parent: ITNode<T> | undefined;
    leftSibling: ITNode<T> | undefined;
}

export class Tree<T> {
    private nodes: ITNode<T>[];

    public constructor(root?: T) {
        this.nodes = [];
        if(root) {
            const node: ITNode<T> = {
                object: root,
                children: [],
                parent: undefined,
                leftSibling: undefined
            };
            this.nodes.push(node);
        }
    }

    public getTree(): ITNode<T>[] {
        return this.nodes;
    }

    public addToNode(objects: T[], node: ITNode<T> | undefined): ITNode<T>[]
    {
        const children: ITNode<T>[] = [];
        let leftSibling: ITNode<T> | undefined = undefined;
        objects.forEach((obj) => {
            const child: ITNode<T> = {
                object: obj,
                children: [],
                parent: node,
                leftSibling: leftSibling
            };
            children.push(child);
            leftSibling = child;
        })

        if (node === undefined) {
            this.nodes = this.nodes.concat(children);
        }
        else {
            node.children = node.children.concat(children);
        }
        return children;
    }

    public removeNode(node: ITNode<T> | undefined): ITNode<T> | undefined
    {
        if (node === undefined) {
            return undefined;
        }

        let children = node.parent === undefined ? this.nodes : node.parent.children;
        const index = children.indexOf(node, 0);
        if (index > -1) {
            children.splice(index, 1);
        }

        if (children.length > index) {
            const leftSibling = index === 0 ? undefined : children[index - 1];
            children[index].leftSibling = leftSibling;
        }
        return node.parent;
    }

    public getFirstChildFromNode(node: ITNode<T> | undefined): ITNode<T> | undefined {
        let children = node === undefined ? this.nodes : node.children;
        if (children.length === 0) {
            return undefined;
        }
        return children[0];
    }

    public popFrontChildFromNode(node: ITNode<T> | undefined): ITNode<T> | undefined {
        let children = (node === undefined) ? this.nodes : node.children;
        if (children.length === 0) {
            return undefined;
        }
        const child = children[0];
        this.removeNode(child);
        return child;
    }

    public getFirstLeftSibling(node: ITNode<T>): ITNode<T> | undefined {
        if (node.leftSibling === undefined) {
            return undefined;
        }

        let sibling = node.leftSibling;
        while (sibling.leftSibling !== undefined) {
            sibling = sibling.leftSibling;
        }

        return sibling;
    }
}