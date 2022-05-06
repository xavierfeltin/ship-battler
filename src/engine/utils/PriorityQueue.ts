import { BinaryTree } from "./BinaryTree";

export class PriorityQueue<T> {
    private bt: BinaryTree<T>;

    public constructor() {
        this.bt = new BinaryTree();
    }

    public push(priority: number, object: any) {
        this.bt.addNode({
            value: priority,
            object: object
        });
    }

    public pop(): T | undefined {
        const node = this.bt.popMin();
        return node === undefined ? undefined : node.object;
    }

    public empty(): boolean {
        return this.bt.empty();
    }

    public size(): number {
        return this.bt.getBT().size;
    }
}