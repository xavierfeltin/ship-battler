import { IComponent } from '../IComponent';
import { Planner } from '../../bot/Planner';

export class CPlanner implements IComponent {
  public static id: string = "Planner";
  public id: string = CPlanner.id;

  private _bot: Planner;
    public get bot(): Planner {
        return this._bot;
    }
    public set bot(bot: Planner) {
        this._bot = bot;
    }

  constructor() {
    this._bot = new Planner();
  }
}