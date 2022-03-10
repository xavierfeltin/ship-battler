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

        if(this.values.get(root) === undefined){
            console.error("[BT Error] Can't set left child at " + leftIndexForRoot + " no parent found at " + root);
            return -1;
        }
        this.values.set(leftIndexForRoot, node);
        return leftIndexForRoot;
    }

    public setRight(node: IBTNode, root: number): number {
        const rightIndexForRoot = this.nextRightSideIndex(root);

        if(this.values.get(root) === undefined){
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

        if (this.minIndex === 0) {
            this.rebuild();
        }
        else {
            this.minIndex = this.prevLeftSideIndex(this.minIndex);
        }
        return min;
    }

    public popMax(): IBTNode | undefined {
        const max = this.values.get(this.maxIndex);
        this.values.delete(this.maxIndex);

        if (this.maxIndex === 0) {
            this.rebuild();
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
        let isBottom = this.values.get(0) === undefined;
        while (!isBottom) {
            let nextIndex = node.value >= this.values.get(index).value ? this.nextRightSideIndex(index) : this.nextLeftSideIndex(index);
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== undefined) {
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
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== undefined) {
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
            if (this.values.has(nextIndex) && this.values.get(nextIndex) !== undefined) {
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

    public rebuild(): void {
        this.minIndex = 0;
        this.maxIndex = 0;
        let minValue: number = Infinity;
        let maxValue: number = -Infinity;

        let matchingIndexMap = new Map<Number,number>();

        const oldIndexes = Array.from(this.values.keys()).sort((a, b) => {return a-b});
        //const newIndexes: number[] = []        
        for (let oldIndex of oldIndexes) {
            const node = this.values.get(oldIndex);

            if (node === undefined) {
                console.error("[BT rebuild] The node at " + oldIndex + " is undefined");
                continue;
            }

            const parentIndex = (oldIndex % 2) === 0 ? this.prevRightSideIndex(oldIndex) : this.prevLeftSideIndex(oldIndex);
            
            if (parentIndex === 0) {
                this.values.set(0, node);
                this.values.delete(oldIndex); 
                matchingIndexMap.set(oldIndex, 0);

                if (node.value < minValue) {
                    this.minIndex = 0;
                    minValue = node.value;
                }
    
                if (node.value > maxValue) {
                    this.maxIndex = 0;
                    maxValue = node.value;
                }
            }
            else {
                const matchingIndex = matchingIndexMap.get(parentIndex);
                if (node.value % 2 === 0 && matchingIndex !== undefined) {                    
                    const newIndex = this.setRight(node, matchingIndex);
                    this.values.delete(oldIndex); 
                    matchingIndexMap.set(oldIndex, newIndex);
                    
                    if (node.value < minValue && newIndex !== undefined) {
                        this.minIndex = newIndex;
                        minValue = node.value;
                    }
        
                    if (node.value > maxValue && newIndex !== undefined) {
                        this.maxIndex = newIndex;
                        maxValue = node.value;
                    }
                }
                else if (matchingIndex !== undefined) {
                    const newIndex = this.setLeft(node, matchingIndex);
                    this.values.delete(oldIndex);
                    matchingIndexMap.set(oldIndex, newIndex);
                    
                    if (node.value < minValue && newIndex !== undefined) {
                        this.minIndex = newIndex;
                        minValue = node.value;
                    }
        
                    if (node.value > maxValue && newIndex !== undefined) {
                        this.maxIndex = newIndex;
                        maxValue = node.value;
                    }
                }
            }                 
        }
    }
}