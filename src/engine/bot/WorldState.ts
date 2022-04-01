export class WorldState {
    private _states: Map<number, any>;
    public get states(): Map<number, any> {
        return this._states;
    }
    public set states(value: Map<number, any>) {
        this._states = value;
    }

    public constructor() {
        this._states = new Map<number, any>();
    }

    public changeState(index: number, value: number): void {
        this.states.set(index, value);
    }

    public getState(index: number): any | undefined {
        return this.states.get(index);
    }
}
