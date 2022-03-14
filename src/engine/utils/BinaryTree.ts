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

    public setLeft(node: IBTNode, root: number): number {
        const leftIndexForRoot = this.nextLeftSideIndex(root);

        if(!this.values.has(root)){
            console.error("[BT Error] Can't set left child at " + leftIndexForRoot + " no parent found at " + root);
            return -1;
        }
        this.values.set(leftIndexForRoot, node);
        return leftIndexForRoot;
    }

    public setRight(node: IBTNode, root: number): number {
        const rightIndexForRoot = this.nextRightSideIndex(root);

        if(!this.values.has(root)){
            console.error("[BT Error] Can't set right child at " + rightIndexForRoot + " no parent found at " + root);
            return -1;
        }

        this.values.set(rightIndexForRoot, node);
        return rightIndexForRoot;
    }

    public nextLeftSideIndex(root: number): number {
        return (root * 2) + 1;
    }

    public nextRightSideIndex(root: number): number {
        return (root * 2) + 2;
    }

    public prevLeftSideIndex(root: number): number {
        return root === 0 ? 0 : (root - 1) / 2;
    }

    public prevRightSideIndex(root: number): number {
        return root === 0 ? 0 : (root - 2) / 2;
    }

    public popMin(): IBTNode | undefined {
        const min = this.values.get(this.minIndex);
        this.values.delete(this.minIndex);
        const nextLeftIndex = this.nextLeftSideIndex(this.minIndex);
        const nextRightIndex = this.nextRightSideIndex(this.minIndex);

        if (this.values.has(nextLeftIndex) || this.values.has(nextRightIndex)) {
            this.rebuild(this.minIndex);
        }
        else {
            this.minIndex = this.prevLeftSideIndex(this.minIndex);
        }
        return min;
    }

    public popMax(): IBTNode | undefined {
        const max = this.values.get(this.maxIndex);
        this.values.delete(this.maxIndex);
        const nextLeftIndex = this.nextLeftSideIndex(this.maxIndex);
        const nextRightIndex = this.nextRightSideIndex(this.maxIndex);

        if (this.values.has(nextLeftIndex) || this.values.has(nextRightIndex)) {
             // Need to rebuild if the popped element is a root of a subbranch
            this.rebuild(this.maxIndex);
        }
        else {
            this.maxIndex = this.prevRightSideIndex(this.maxIndex);
        }
        return max;
    }

    public addNode(node: IBTNode) {
        if (this.values.size === 0) {
            this.root(node);
            return;
        }

        const rootIndex = this.findRoot(node);
        if (node.value > this.values.get(rootIndex).value) {
            this.setRight(node, rootIndex);

            const indexNewNode = this.nextRightSideIndex(rootIndex);
            if (!this.values.has(this.maxIndex) || this.values.get(indexNewNode)?.value > this.values.get(this.maxIndex)?.value) {
                this.maxIndex = indexNewNode;
            }
        }
        else {
            this.setLeft(node, rootIndex);

            const indexNewNode = this.nextLeftSideIndex(rootIndex);
            if (!this.values.has(this.minIndex) || this.values.get(indexNewNode)?.value < this.values.get(this.minIndex)?.value) {
                this.minIndex = indexNewNode;
            }
        }
    }

    public findRoot(node: IBTNode): number {
        let index: number = 0;
        let rootFound = false;
        while (!rootFound) {
            let nextIndex = node.value >= this.values.get(index).value ? this.nextRightSideIndex(index) : this.nextLeftSideIndex(index);
            if (this.values.has(nextIndex)) {
                index = nextIndex;
            }
            else {
                rootFound = true;
            }
        }
        return index;
    }

    public findNewMin(): number {
        let index: number = 0;
        let isBottom = false;
        while (!isBottom) {
            let nextIndex = this.nextLeftSideIndex(index);
            if (this.values.has(nextIndex)) {
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
            if (this.values.has(nextIndex)) {
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

    public rebuild(root: number): void {
        this.minIndex = 0;
        this.maxIndex = 0;

        const nodesToMove = this.extractNodesFromRoot(root);
        nodesToMove.forEach((node, idx) => {
            this.addNode(node);
        });
    }

    public extractNodesFromRoot(root: number): IBTNode[] {
        let nodes: IBTNode[] = [];
        let queue: number[] = [root];
        let dfsIndexes: number[] = [];

        // Get nodes in their appearance order
        while(queue.length > 0) {
            const currentIndex = queue.pop();
            const leftIndex = this.nextLeftSideIndex(currentIndex);
            const rightIndex = this.nextRightSideIndex(currentIndex);

            if(this.values.has(leftIndex)) {
                queue.push(leftIndex);
                nodes.push(this.values.get(leftIndex));
                dfsIndexes.push(leftIndex);
            }

            if (this.values.has(rightIndex)) {
                queue.push(rightIndex);
                nodes.push(this.values.get(rightIndex));
                dfsIndexes.push(rightIndex);
            }
        }

        // Clean subtree in reverse order
        dfsIndexes.forEach((index) => {
            this.values.delete(index);
        });

        return nodes;
    }
}