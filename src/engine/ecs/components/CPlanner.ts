import { IComponent } from '../IComponent';
import { Planner } from '../../bot/Planner';

export class CPlanner<T> implements IComponent {
  public static id: string = "Planner";
  public id: string = CPlanner.id;

  private _bot: Planner<T>;
    public get bot(): Planner<T> {
        return this._bot;
    }
    public set bot(bot: Planner<T>) {
        this._bot = bot;
    }

  constructor() {
    this._bot = new Planner<T>();
  }
}