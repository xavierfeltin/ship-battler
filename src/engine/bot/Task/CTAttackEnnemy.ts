import { CompoundTask } from "./CompoundTask";
import { TNavigateTo } from "./TNavigateTo";
import { TFireAt } from "./TFireAt";
import { Method } from "./Method";

export class CTAttackEnnemy<T extends {isMoving: number; isInRange: number;}> extends CompoundTask<T> {
    public constructor(indexes: T) {
        super();
        this.methods = [];

        let method = new Method<T>();
        method.pushTask(new TNavigateTo<T>(indexes));
        method.pushTask(new TFireAt<T>(indexes));
        this.methods.push(method);
    }
}