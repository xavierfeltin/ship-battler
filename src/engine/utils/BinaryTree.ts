export interface IBTNode {
    value: number;
    object: any;
}

export class BinaryTree {
    private values: Map<number, IBTNode>; //IBTNode[];
    private minIndex: number;
    private maxIndex: number;

    public constructor(node?: IBTNode) {
        if(node) {
            this.values = new Map();//[];
            this.root(node);
        }
        else {
            this.values = new Map();//[];
        }
    }

    public root(node: IBTNode) {
        this.values.clear();//[];
        this.values.set(0, node);
    }

    public setLeft(node: IBTNode, root: number) {
        const leftIndexForRoot = this.nextLeftSideIndex(root);

        if(this.values.get(root) === null){
            console.error("[BT Error] Can't set left child at " + leftIndexForRoot + " no parent found at " + root);
        }
        this.values.set(leftIndexForRoot, node);
    }

    public setRight(node: IBTNode, root: number) {
        const rightIndexForRoot = this.nextRightSideIndex(root);

        if(this.values.get(root) === null){
            console.error("[BT Error] Can't set right child at " + rightIndexForRoot + " no parent found at " + root);
        }
        this.values.set(rightIndexForRoot, node);
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
        const min = this.values.get(this.minIndex);
        this.minIndex = null;

        if (this.minIndex === 0) {
            this.rebuildRightSide();
        }
        else {
            this.minIndex = this.prevLeftSideIndex(this.minIndex);
        }
        return min;
    }

    public popMax(): IBTNode {
        const max = this.values.get(this.maxIndex);
        this.maxIndex = null;

        if (this.maxIndex === 0) {
            this.rebuildLeftSide();
        }
        else {
            this.maxIndex = this.prevRightSideIndex(this.maxIndex);
        }
        return max;
    }

    public addNode(node: IBTNode) {
        const rootIndex = this.findRoot(node);
        if (node.value > this.values.get(rootIndex).value) {
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
        let isBottom = this.values.get(0) === null;
        while (!isBottom) {
            let nextIndex = node.value >= this.values.get(index).value ? this.nextRightSideIndex(index) : this.nextLeftSideIndex(index);
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== null) {
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
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== null) {
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
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== null) {
                index = nextIndex;
            }
            else {
                isBottom = true;
            }
        }
        return index;
    }

    public getBT(): Map<number, IBTNode> {
        return this.values;
    }

    public rebuildRightSide(): void {
        let minValue = this.values.get(0).value;
        let maxValue = this.values.get(0).value;

        this.values.forEach((node, key) => {
            const newIndex = this.prevRightSideIndex(key);
            this.values.set(newIndex,node);
            this.values.delete(key);

            if (node.value < minValue) {
                this.minIndex = newIndex;
                minValue = node.value;
            }

            if (node.value > maxValue) {
                this.maxIndex = newIndex;
                maxValue = node.value;
            }
        });
    }

    public rebuildLeftSide(): void {
        let minValue = this.values.get(0).value;
        let maxValue = this.values.get(0).value;

        this.values.forEach((node, key) => {
            const newIndex = this.prevLeftSideIndex(key);
            this.values.set(newIndex,node);
            this.values.delete(key);

            if (node.value < minValue) {
                this.minIndex = newIndex;
                minValue = node.value;
            }

            if (node.value > maxValue) {
                this.maxIndex = newIndex;
                maxValue = node.value;
            }
        });
    }
}