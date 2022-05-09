
import { BinaryMinHeap } from "./BinaryMinHeap";

test('Creating an empty binary heap', () => {
    const bh = new BinaryMinHeap<string>();
    expect(bh.length()).toBe(0);
});

test('Insert an element in the binary heap, it should be the min element', () => {
    const bh = new BinaryMinHeap<string>();
    bh.push({
        priority: 1,
        object: "Obj1"
    });
    expect(bh.length()).toBe(1);

    expect(bh.getMin()?.priority).toBe(1);
    expect(bh.getMin()?.object).toBe("Obj1");
});

test('Min of an empty min heap should be undefined', () => {
    const bh = new BinaryMinHeap<string>();
    expect(bh.getMin()).toBeUndefined();
});

test('Heap should keep track of its min element with multiple insertions', () => {
    const bh = new BinaryMinHeap<string>();
    let minPriority = Infinity;
    for(let i = 0; i < 100; i++) {
        const priority = Math.ceil(Math.random() * 100);
        if (priority < minPriority ) {
            minPriority = priority;
        }

        bh.push({
            priority: priority,
            object: "Obj" + priority
        });
    }
    expect(bh.length()).toBe(100);
    expect(bh.getMin()?.priority).toBe(minPriority);
    expect(bh.getMin()?.object).toBe("Obj" + minPriority);
});

test('Heap should keep track of its min element with multiple removes', () => {
    const bh = new BinaryMinHeap<string>();
    let priorities = [];
    for(let i = 0; i < 100; i++) {
        const priority = Math.ceil(Math.random() * 1000);
        priorities.push(priority);

        bh.push({
            priority: priority,
            object: "Obj" + priority
        });
    }
    priorities.sort((a: number, b: number) => b - a);

    while (priorities.length > 0) {
        const min = bh.pop();
        const expectedMin = priorities.pop();
        expect(min?.priority).toBe(expectedMin);
        expect(min?.object).toBe("Obj" + expectedMin);
    }
    expect(bh.length()).toBe(0);
});
