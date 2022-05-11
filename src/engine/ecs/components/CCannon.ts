import { IComponent } from '../IComponent';

export class CCannon implements IComponent {
    public static id: string = 'Cannon';
    public id: string = CCannon.id;

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

    private _hasFired: boolean;
    public get hasFired(): boolean {
        return this._hasFired;
    }
    public set hasFired(value: boolean) {
        this._hasFired = value;
    }

    public constructor(time: number) {
        this._counter = time;
        this._reloadTime = time;
        this._hasFired = false;
    }

    public decrement(): void {
        if (this._counter === 0) {
            return;
        }
        this._counter = this._counter - 1;
    }

    public reset(): void {
        this._counter = this._reloadTime;
        this.hasFired = false;
    }

    public isOperational(): boolean {
        return this._counter === this.reloadTime && !this.hasFired;
    }

    public isCooldownOver(): boolean {
        return this._counter === 0;
    }

    public fire() {
        this._hasFired = true;
    }
}