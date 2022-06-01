import { ShipRole, Team } from '../../GameEngine';
import { IComponent } from '../IComponent';

export class CShip implements IComponent {
  public static id: string = 'Ship';
  public id: string = CShip.id;

  private _team: Team;
  public get team(): Team {
    return this._team;
  }
  public set team(value: Team) {
    this._team = value;
  }
  private _role: ShipRole;
  public get role(): ShipRole {
    return this._role;
  }
  public set role(value: ShipRole) {
    this._role = value;
  }

  private _miningDistance: number;
  public get miningDistance(): number {
    return this._miningDistance;
  }
  public set miningDistance(value: number) {
    this._miningDistance = value;
  }

  private _shootingDistance: number;
  public get shootingDistance(): number {
    return this._shootingDistance;
  }
  public set shootingDistance(value: number) {
    this._shootingDistance = value;
  }

  private _protectingDistance: number;
  public get protectingDistance(): number {
    return this._protectingDistance;
  }
  public set protectingDistance(value: number) {
    this._protectingDistance = value;
  }

  public constructor(miningDistance: number, shootingDistance: number, protectingDistance: number, team: Team, role: ShipRole) {
    this._miningDistance = miningDistance;
    this._shootingDistance = shootingDistance;
    this._protectingDistance = protectingDistance;
    this._team = team;
    this._role = role;
  }
}