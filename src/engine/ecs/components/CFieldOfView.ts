import { IComponent } from '../IComponent';

export class CFieldOfView implements IComponent {
    public static id: string = "FieldOfView";
    public id: string = CFieldOfView.id;

    private _angle: number;
    public get angle(): number {
        return this._angle;
    }
    public set angle(value: number) {
        this._angle = value;
    }

    private _depth: number;
    public get depth(): number {
        return this._depth;
    }
    public set depth(value: number) {
        this._depth = value;
    }

    constructor(angle: number, depth: number) {
        this._angle = angle;
        this._depth = depth;
    }
}