export interface IBTNode {
    value: number;
    object: any;
}

export class BinaryTree {
    private values: IBTNode[];
    private minIndex: number;
    private maxIndex: number;

    public constructor(node?: IBTNode) {
        if(node) {
            this.values = [];
            this.root(node);
        }
        else {
            this.values = [];
        }
    }

    public root(node: IBTNode) {
        this.values = []; // Clean the BT beforehand
        this.values.push(node);
    }

    public setLeft(node: IBTNode, root: number) {
        const leftIndexForRoot = this.nextLeftSideIndex(root);

        if(this.values[root] === null){
            console.error("[BT Error] Can't set left child at " + leftIndexForRoot + " no parent found at " + root);
        }
        else if (leftIndexForRoot < this.values.length) {
            this.values[leftIndexForRoot] = node;
        }
        else {
            while (this.values.length < leftIndexForRoot)
            {
                this.values.push(null);
            }
            this.values.push(node);
        }
    }

    public setRight(node: IBTNode, root: number) {
        const rightIndexForRoot = this.nextRightSideIndex(root);

        if(this.values[root] === null){
            console.error("[BT Error] Can't set right child at " + rightIndexForRoot + " no parent found at " + root);
        }
        else if (rightIndexForRoot < this.values.length) {
            this.values[rightIndexForRoot] = node;
        }
        else {
            while (this.values.length < rightIndexForRoot)
            {
                this.values.push(null);
            }
            this.values.push(node);
        }
    }

    public nextLeftSideIndex(root: number): number {
        return (root * 2) + 1
    }

    public nextRightSideIndex(root: number): number {
        return (root * 2) + 2;
    }

    public popMin(): IBTNode {
        const min = this.values[this.minIndex].object;
        this.values[this.minIndex] = null;
        return min;
    }

    public popMax(): IBTNode {
        const max = this.values[this.maxIndex].object;
        this.values[this.maxIndex] = null;
        return max;
    }

    public addNode(node: IBTNode) {
        const rootIndex = this.findRoot(node);
        if (node.value > this.values[rootIndex].value) {
            this.setRight(node, rootIndex);
            this.maxIndex = this.nextRightSideIndex(rootIndex);
        }
        else {
            this.setLeft(node, rootIndex);
            this.minIndex = this.nextLeftSideIndex(rootIndex);
        }
    }

    public findRoot(node: IBTNode): number {
        let index: number = 0;
        let isBottom = false;
        while (!isBottom) {
            let nextIndex = node.value >= this.values[index].value ? this.nextRightSideIndex(index) : this.nextLeftSideIndex(index);
            if (nextIndex < this.values.length && this.values[nextIndex] !== null) {
                index = nextIndex;
            }
            else {
                isBottom = true;
            }
        }
        return index;
    }

    public getBT(): IBTNode[] {
        return this.values;
    }
}