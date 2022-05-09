import { BinaryMinHeap } from "./BinaryMinHeap";

export class PriorityQueue<T> {
    private bh: BinaryMinHeap<T>;

    public constructor() {
        this.bh = new BinaryMinHeap<T>();
    }

    public push(priority: number, object: T) {
        this.bh.push({
            priority: priority,
            object: object
        });
    }

    public pop(): T | undefined {
        const node = this.bh.pop();
        return node === undefined ? undefined : node.object;
    }

    public empty(): boolean {
        return this.bh.isEmpty();
    }

    public length(): number {
        return this.bh.length();
    }
}