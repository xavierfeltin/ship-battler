import { Domain } from "./Domain";
import { IComponent } from "../ecs/IComponent";
import { IEntity } from "../ecs/IEntity";
import { IAActionState } from "./IAIAction";
import { CompoundTask } from "./Task/CompoundTask";
import { Task } from "./Task/Task";
import { Method } from "./Task/Method";
import { ITNode, Tree } from "../utils/Tree";
import { WorldState } from "./WorldState";

interface SequenceState<T> {
    firstTaskIndexInPlanning: number; // Index where to start to invalidate all the sequence in the planning
    worldState: WorldState; // World state before starting the sequence
    parent: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>; // The node to rollback to
}

export class Planner<T> {
    private planning: Task<T>[];
    private actionBeingSolved: Task<T> | undefined;
    private sequenceStack: SequenceState<T>[];

    public constructor() {
        this.planning = [];
        this.actionBeingSolved = undefined;
        this.sequenceStack = [];
    }

    public planify(domain: Domain<T>, agent: IEntity): IComponent[] {

        // If action being solved is over or no longer valid, get next action on planning
        // if planning no longer valid, regenerate a planning
        if (this.actionBeingSolved === undefined || this.actionBeingSolved.state === IAActionState.DONE) {
            let actionName = this.actionBeingSolved === undefined ? "undefined" : this.actionBeingSolved.info();
            console.log("[Planify] the current action " + actionName + " is now done. Start a new one");

            if(this.planning.length === 0) {
                this.buildPlanning(domain, agent);
            }

            this.actionBeingSolved = this.planning.pop();
            actionName = this.actionBeingSolved === undefined ? "undefined" : this.actionBeingSolved.info();
            console.log("[Planify] Start new action " + actionName);
        }

        // else the current action is still being solved
        const nextActionsToPerformByAgent = this.solve(agent);
        return nextActionsToPerformByAgent;
    }

    public replanify(domain: Domain<T>, agent: IEntity) {
        console.log("[Planify] the current action " + (this.actionBeingSolved === undefined ? "undefined" : this.actionBeingSolved.info()) + " is can no longer be solved. Replanify");
        this.buildPlanning(domain, agent);
        this.actionBeingSolved = this.planning.pop();

        const nextActionsToPerformByAgent = this.solve(agent);
        return nextActionsToPerformByAgent;
    }

    public isNeedingAReplanification(domain: Domain<T>): boolean {
        return this.actionBeingSolved === undefined ? true : this.actionBeingSolved.isNeedingReplanify(domain.getWorldState());
    }

    private solve(agent: IEntity): IComponent[] {
        if (this.actionBeingSolved === undefined) {
            return [];
        }

        let nextActions = this.actionBeingSolved.operate(agent);
        return nextActions;
    }

    private buildPlanning(domain: Domain<T>, agent: IEntity): void {
        console.log("[BuildPlanning] generate a new planning for agent " + agent.name);
        this.planning = [];

        let availableTasks: (Task<T> | CompoundTask<T>)[] = domain.getAvailableTasks();
        let worldState = domain.getWorldState();

        let decompositionHistory: Tree<Task<T> | CompoundTask<T> | Method<T> | undefined> = new Tree<Task<T> | CompoundTask<T> | Method<T> | undefined>();
        decompositionHistory.addToNode(availableTasks, undefined);

        let currentNode = this.advanceInSequence(undefined, decompositionHistory);
        while(currentNode !== undefined) {
            let current: Task<T> | CompoundTask<T> | Method<T> | undefined = currentNode.object;
            if (current instanceof CompoundTask) {
                // Add all the methods that can be applied in the tree
                let satisfiedMethods = current.findSatisfiedMethods(worldState);
                if (satisfiedMethods.length > 0) {
                    this.saveSequence(Math.max(0, this.planning.length - 1), worldState, currentNode);
                    decompositionHistory.addToNode(satisfiedMethods, currentNode);
                    currentNode = this.advanceInSequence(currentNode, decompositionHistory);
                }
                else {
                    // No method found so rollback to previous sequence
                    currentNode = this.alternateInSequence(currentNode, decompositionHistory);
                }
            }
            else if (current instanceof Method) {
                // Add all the tasks composing the method to the tree
                const methodTasks = current.decompose();
                decompositionHistory.addToNode(methodTasks, currentNode);
                currentNode = this.advanceInSequence(currentNode, decompositionHistory);
            }
            else if (current instanceof Task) {
                // Try to add the task to the planner if it can be applied
                if (current.canBeRun(worldState)) {
                    worldState = current.applyEffects(worldState);
                    this.planning.push(current);

                    // Advance in the sequence
                    currentNode = this.advanceInSequence(currentNode, decompositionHistory);
                }
                else {
                    // The task can not be applied, it invalidates the sequence so rollback to previous sequence
                    currentNode = this.alternateInSequence(currentNode, decompositionHistory);
                }
            }
        }
        console.log("[BuildPlanning] new planning built for " + agent.name + ": " + this.planning.map(task => task.info()).join(", "));
        this.planning = this.planning.reverse();
    }

    private saveSequence(taskIndex: number, worldState: WorldState, parent: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>): SequenceState<T> {
        let sequence: SequenceState<T> = {
            firstTaskIndexInPlanning: taskIndex,
            worldState: worldState,
            parent: parent
        };
        this.sequenceStack.push(sequence);
        return sequence;
    }

    private rollbackSequence(): void {
        const removedSequence = this.sequenceStack.pop();
        if (removedSequence === undefined) {
            return;
        }

        // Delete all the tasks added during the sequence
        this.planning.splice(removedSequence.firstTaskIndexInPlanning);
    }

   // Get next node to develop to build the planning
    private advanceInSequence(currentNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined, history: Tree<Task<T> | CompoundTask<T> | Method<T> | undefined>): ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined {
        if (currentNode === undefined) {
            return history.popFrontChildFromNode(undefined);
        }

        let nextNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined = currentNode
        let hasReachedTheSequenceEnd: boolean = false;
        let hasAdvanced = false;
        while (!(hasAdvanced || hasReachedTheSequenceEnd) && nextNode!==undefined) {
            if (nextNode.object instanceof Task) {
                // Get next node on the same level
                const parent: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined = nextNode.parent;
                nextNode = history.popFrontChildFromNode(nextNode.parent);
                if (nextNode === undefined && parent === undefined) {
                    hasReachedTheSequenceEnd = true;
                }
                else if (nextNode === undefined) {
                    // It was the last node on this level go back to compound task parent
                    const methodNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> = parent as ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>;
                    const compoundTaskNode: ITNode<CompoundTask<T>> = methodNode.parent as ITNode<CompoundTask<T>>;
                    compoundTaskNode.children = []; //Remove other alternative methods since the sequence has been successful
                    nextNode = compoundTaskNode;
                }
                else {
                    // Evaluate next node in the same level
                    hasAdvanced = true;
                }
            }
            else if (nextNode.object instanceof CompoundTask) {
                if (nextNode.children.length > 0) {
                    // Advance deeper in the first available method to solve the compound task
                    nextNode = history.popFrontChildFromNode(currentNode);
                    hasAdvanced = true;
                }
                else {
                    // Get next node on the same level
                    const parent: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined = nextNode.parent;
                    nextNode = history.popFrontChildFromNode(parent);
                    if (nextNode === undefined && parent === undefined) {
                        hasReachedTheSequenceEnd = true;
                    }
                    else if (nextNode === undefined) {
                        // It was the last node on this level go back to compound task parent
                        const methodNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> = parent as ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>;
                        const compoundTaskNode: ITNode<CompoundTask<T>> = methodNode.parent as ITNode<CompoundTask<T>>;
                        compoundTaskNode.children = []; //Remove other alternative methods since the sequence has been successful
                        nextNode = compoundTaskNode;
                    }
                    else {
                        // Evaluate next node in the same level
                        hasAdvanced = true;
                    }
                }
            }
            else if (nextNode.object instanceof Method) {
                if (nextNode.children.length > 0) {
                    // Advance deeper in the method's tasks
                    nextNode = history.popFrontChildFromNode(nextNode);
                    hasAdvanced = true;
                }
                else {
                    // Should not happened except if the method has been defined without any task (considered always successful)
                    console.warn("The method does not have any task so it will go back to the compound task parent");
                    const compoundTaskNode: ITNode<CompoundTask<T>> = nextNode.parent as ITNode<CompoundTask<T>>;
                    compoundTaskNode.children = []; //Remove other alternative methods since the sequence has been successful
                    nextNode = compoundTaskNode;
                }
            }
        }
        return nextNode;
    }

    // Go to the next alternavite method (no other alternative methods, or the task failed invalidating the sequence)
    private alternateInSequence(currentNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>, history: Tree<Task<T> | CompoundTask<T> | Method<T> | undefined>): ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined {
        if (currentNode === undefined) {
            return undefined;
        }

        let nextNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> | undefined = currentNode
        let hasReachedTheSequenceEnd: boolean = false;
        let hasFoundAlternative = false;
        while (!(hasFoundAlternative || hasReachedTheSequenceEnd) && nextNode!==undefined) {
            // Each level of compound task, a sequence is rollbacked
            this.rollbackSequence();

            if (nextNode.object instanceof Task) {
                if (nextNode.parent === undefined) {
                    hasReachedTheSequenceEnd = true;
                    nextNode = undefined;
                }
                else {
                    // Try next available method of the parent compound task
                    const methodNode: ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined> = nextNode.parent as ITNode<Task<T> | CompoundTask<T> | Method<T> | undefined>;
                    const compoundTaskNode = methodNode.parent;
                    nextNode = compoundTaskNode;
                }
            }
            else if (nextNode.object instanceof CompoundTask) {
                if (nextNode.children.length > 0) {
                    // Try next alternative method
                    nextNode = history.popFrontChildFromNode(currentNode);
                    hasFoundAlternative = true;
                }
                else {
                    if (nextNode.parent === undefined) {
                        // The compound task was at the root level, if it fails all the sequence of the planning has failed
                        hasReachedTheSequenceEnd = true;
                        nextNode = undefined;
                    }
                    else {
                        // Try next available method of the parent compound task
                        const methodNode = nextNode.parent;
                        const compoundTaskNode = methodNode.parent;
                        nextNode = compoundTaskNode;
                        hasFoundAlternative = true;
                    }
                }
            }
            else {
                console.error("[alternateInSequence] the node is not a Task or a CompoundTask");
                nextNode = undefined;
                hasReachedTheSequenceEnd = true;
            }
        }
        return nextNode;
    }
}