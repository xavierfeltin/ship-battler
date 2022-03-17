export interface IBTNode<T>{
    value: number;
    object: T;
}

export class BinaryTree<T> {
    private values: Map<number, IBTNode<T>>; //IBTNode[];
    private minIndex: number;
    private maxIndex: number;

    public constructor(node?: IBTNode<T>) {
        this.minIndex = 0;
        this.maxIndex = 0;

        if(node) {
            this.values = new Map();
            this.root(node);
        }
        else {
            this.values = new Map();
        }
    }

    public empty(): boolean {
        return this.values.size === 0;
    }

    public root(node: IBTNode<T>) {
        this.values.clear();//[];
        this.values.set(0, node);
    }

    public setLeft(node: IBTNode<T>, root: number): number {
        const leftIndexForRoot = this.nextLeftSideIndex(root);

        if(!this.values.has(root)){
            console.error("[BT Error] Can't set left child at " + leftIndexForRoot + " no parent found at " + root);
            return -1;
        }
        this.values.set(leftIndexForRoot, node);
        return leftIndexForRoot;
    }

    public setRight(node: IBTNode<T>, root: number): number {
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

    public popMin(): IBTNode<T> | undefined {
        if (this.empty()) {
            return undefined;
        }

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

    public popMax(): IBTNode<T> | undefined {
        if (this.empty()) {
            return undefined;
        }

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

    public addNode(node: IBTNode<T>) {
        if (this.values.size === 0) {
            this.root(node);
            return;
        }

        const rootIndex = this.findRoot(node);
        const root = this.values.get(rootIndex);

        if (root && node.value > root.value) {
            this.setRight(node, rootIndex);

            const indexNewNode = this.nextRightSideIndex(rootIndex);
            const newNode = this.values.get(indexNewNode);
            const maxNode = this.values.get(this.maxIndex);
            if (!this.values.has(this.maxIndex) || (newNode && maxNode && newNode.value > maxNode.value)) {
                this.maxIndex = indexNewNode;
            }
        }
        else if (root) {
            this.setLeft(node, rootIndex);

            const indexNewNode = this.nextLeftSideIndex(rootIndex);
            const newNode = this.values.get(indexNewNode);
            const minNode = this.values.get(this.minIndex);
            if (!this.values.has(this.minIndex) || (newNode && minNode && newNode.value < minNode.value)) {
                this.minIndex = indexNewNode;
            }
        }
        else {
            console.error("[addnode] root not found for node " + JSON.stringify(node));
        }
    }

    public findRoot(node: IBTNode<T>): number {
        let index: number = 0;
        let rootFound = false;
        while (!rootFound) {
            const nodeFromIndex = this.values.get(index);
            if (nodeFromIndex === undefined)
            {
                console.error("[findRoot] node from index " + nodeFromIndex + " is undefined");
                break;
            }

            let nextIndex = node.value >= nodeFromIndex.value ? this.nextRightSideIndex(index) : this.nextLeftSideIndex(index);
            if (this.values.has(nextIndex)) {
                index = nextIndex;
            }
            else {
                rootFound = true;
            }
        }
        return rootFound ? index : 0;
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

    public getBT(): Map<number, IBTNode<T>> {
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

    public extractNodesFromRoot(root: number): IBTNode<T>[] {
        let nodes: IBTNode<T>[] = [];
        let queue: number[] = [root];
        let dfsIndexes: number[] = [];

        // Get nodes in their appearance order
        while(queue.length > 0) {
            const currentIndex = queue.pop();
            if (currentIndex === undefined) {
                break;
            }

            const leftIndex = this.nextLeftSideIndex(currentIndex);
            const rightIndex = this.nextRightSideIndex(currentIndex);

            const leftNode = this.values.get(leftIndex);
            if(leftNode !== undefined) {
                queue.push(leftIndex);
                nodes.push(leftNode);
                dfsIndexes.push(leftIndex);
            }

            const rightNode = this.values.get(rightIndex);
            if (rightNode !== undefined) {
                queue.push(rightIndex);
                nodes.push(rightNode);
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