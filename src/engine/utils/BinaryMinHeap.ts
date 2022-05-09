export interface IBHNode<T>{
    priority: number;
    object: T;
}

export class BinaryMinHeap<T> {
    private heap: IBHNode<T>[];
    public constructor() {
        this.heap = [];
    }

    public isEmpty(): boolean {
        return this.heap.length === 0;
    }

    public push(k: IBHNode<T>): void {
        // Add the new element at the end since the tree is complete
        this.heap.push(k);
        this.percolate_up(this.heap.length - 1);
    }

    public pop(): IBHNode<T> | undefined {
        // Get the current min
        const root = this.heap[0];

        // Reorganize the tree by replacing the last element correctly
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.percolate_down(0);

        return root;
    }

    public getMin(): IBHNode<T> | undefined {
        if (this.heap.length === 0) {
            return undefined
        }
        return this.heap[0];
    }

    public length(): number {
        return this.heap.length;
    }

    private left(index: number): number {
        return (index * 2) + 1;
    }

    private right(index: number): number {
        return (index * 2) + 2;
    }

    private swap(from: number, to: number): void {
        const buff = this.heap[to];
        this.heap[to] = this.heap[from];
        this.heap[from] = buff;
    }

    private minChild(index: number): number {
        const left = this.left(index);
        const right = this.right(index);

        if (right >= this.heap.length) {
            return left;
        }

        if (this.heap[left].priority < this.heap[right].priority) {
            return left;
        }
        return right;
    }

    public parent(index: number): number {
        return  Math.floor((index - 1) / 2);
    }

    // Reposition the element to its correct place by successively swapping with its parent
    private percolate_up(index: number) {
        let current = index;
        let parent = this.parent(current);

        // Reposition the element to its correct place by successively swapping with its parent
        while(current !== 0 && this.heap[current].priority < this.heap[parent].priority) {
            this.swap(current, parent);
            current = parent;
            parent = this.parent(current);
        }
    }

    // Reposition the first element to its correct place by successively swapping with its children
    private percolate_down(index: number) {
        let current = index;
        while(this.left(current) < this.heap.length) {
            const minChild = this.minChild(current);
            if (this.heap[minChild].priority < this.heap[current].priority) {
                this.swap(current, minChild);
            }
            current = minChild;
        }
    }
}