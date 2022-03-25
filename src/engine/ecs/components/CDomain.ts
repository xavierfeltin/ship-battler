import { Domain } from '../../bot/Domain';
import { IComponent } from '../IComponent';

export class CDomain<T> implements IComponent {
  public static id: string = "Domain";
  public id: string = CDomain.id;

  private _domain: Domain<T>;
    public get domain(): Domain<T> {
        return this._domain;
    }
    public set domain(value: Domain<T>) {
        this._domain = value;
    }

  public constructor(domain: Domain<T>) {
    this._domain = domain;
  }
}