import { Vect2D } from '../../utils/Vect2D';
import { IComponent } from '../IComponent';

export class CBouncing implements IComponent {
    public static id: string = 'Bouncing';
    public id: string = CBouncing.id;

    private _velocity: Vect2D;
    public get velocity(): Vect2D {
        return this._velocity;
    }
    public set velocity(value: Vect2D) {
        this._velocity = value;
    }

    private _counter: number;
    public get counter(): number {
        return this._counter;
    }
    public set counter(value: number) {
        this._counter = value;
    }

    public constructor(velocity: Vect2D, counter: number) {
        this._velocity = velocity;
        this._counter = counter;
    }

    public decrement(): void {
        this._counter -= 1;
    }

    public isOver(): boolean {
        return this._counter <= 0;
    }
}