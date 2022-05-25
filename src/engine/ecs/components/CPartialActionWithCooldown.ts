export class CPartialActionWithCooldown {
    private _reloadTime: number;
    public get reloadTime(): number {
        return this._reloadTime;
    }
    public set reloadTime(value: number) {
        this._reloadTime = value;
    }

    private _counter: number;
    public get counter(): number {
        return this._counter;
    }
    public set counter(value: number) {
        this._counter = value;
    }

    private _hasBeenActivated: boolean;
    public get hasBeenActivated(): boolean {
        return this._hasBeenActivated;
    }
    public set hasBeenActivated(value: boolean) {
        this._hasBeenActivated = value;
    }

    public decrement(): void {
        if (this._counter === 0) {
            return;
        }
        this._counter = this._counter - 1;
    }

    public reset(): void {
        this._counter = this._reloadTime;
        this.hasBeenActivated = false;
    }

    public isOperational(): boolean {
        return this._counter === this.reloadTime && !this.hasBeenActivated;
    }

    public isCooldownOver(): boolean {
        return this._counter === 0;
    }

    public activate() {
        this._hasBeenActivated = true;
    }

    public constructor(reloadTime: number) {
        this._counter = reloadTime;
        this._reloadTime = reloadTime;
        this._hasBeenActivated = false;
    }
}