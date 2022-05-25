import { IComponent } from '../IComponent';
import { CPartialActionWithCooldown } from './CPartialActionWithCooldown';

export class CCannon  extends CPartialActionWithCooldown implements IComponent {
    public static id: string = 'Cannon';
    public id: string = CCannon.id;

    public constructor(reloadTime: number) {
        super(reloadTime);
    }
}