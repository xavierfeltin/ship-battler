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
        return (root * 2) + 1;
    }

    public nextRightSideIndex(root: number): number {
        return (root * 2) + 2;
    }

    public prevLeftSideIndex(root: number): number {
        return (root - 1) / 2;
    }

    public prevRightSideIndex(root: number): number {
        return (root * 2) / 2;
    }

    public popMin(): IBTNode {
        const min = this.values[this.minIndex];
        this.values[this.minIndex] = null;
        if (this.minIndex === 0) {
            this.values = this.values.slice(2); //if the root is removed it means the right element of the first level is the new root
            this.minIndex = this.findNewMin();
        }
        else {
            this.minIndex = this.prevLeftSideIndex(this.minIndex);
        }
        return min;
    }

    public popMax(): IBTNode {
        const max = this.values[this.maxIndex];
        this.values[this.maxIndex] = null;
        if (this.maxIndex === 0) {
            this.values = this.values.slice(1); //if the root is removed it means the left element of the first level is the new root
            this.maxIndex = this.findNewMax();
        }
        else {
            this.maxIndex = this.prevRightSideIndex(this.maxIndex);
        }
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

    public findNewMin(): number {
        let index: number = 0;
        let isBottom = false;
        while (!isBottom) {
            let nextIndex = this.nextLeftSideIndex(index);
            if (nextIndex < this.values.length && this.values[nextIndex] !== null) {
                index = nextIndex;
            }
            else {
                isBottom = true;
            }
        }
        return index;
    }

    public findNewMax(): number {
        let index: number = 0;
        let isBottom = false;
        while (!isBottom) {
            let nextIndex = this.nextRightSideIndex(index);
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