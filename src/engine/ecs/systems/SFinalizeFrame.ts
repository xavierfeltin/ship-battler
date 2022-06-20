import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { IEntity } from '../IEntity';
import { CActionTurn } from '../components/CActionTurn';
import { CMap } from '../components/CMap';
import { CCannon } from '../components/CCannon';
import { CShip } from '../components/CShip';
import { GameEnityUniqId } from '../../GameEngine';
import { CCollisions } from '../components/CCollisions';
import { CMissile } from '../components/CMissile';
import { CIgnore } from '../components/CIgnore';
import { CTarget } from '../components/CTarget';
import { CShipSensor } from '../components/CShipSensor';
import { CBouncing } from '../components/CBouncing';
import { CTimeFrame } from '../components/CTimeFrame';
import { time } from 'console';

export class SFinalizeFrame implements ISystem {
  public id = 'FinalizeFrame';
  public priority: number;

    public constructor(priority: number) {
        this.priority = priority;
    }

  public onUpdate(ecs: ECSManager): void {
    this.finalizeShips(ecs);
    this.finalizeMissiles(ecs);
    this.finalizeCollisions(ecs);
    this.finalizeFrame(ecs);
  }

  private finalizeShips(ecs: ECSManager) {
    const entities = ecs.selectEntitiesFromComponents([CShip.id]);
    for (let ship of entities) {
      this.coolDownCannons(ship, ecs);
      this.coolDownSensors(ship, ecs);
      this.deleteFrameComponents(ship, ecs);
      this.destroyShip(ship, ecs);
    }
  }

  private coolDownSensors(ship: IEntity, ecs: ECSManager): void {
    const sensor = ship.components.get(CShipSensor.id) as CShipSensor;
    if (sensor !== undefined) {
        if (sensor.isCooldownOver()) {
          sensor.reset();
        }
        else if (sensor.hasBeenActivated) {
          sensor.decrement();
        }
        ecs.addOrUpdateComponentOnEntity(ship, sensor);
    }
  }

  private coolDownCannons(ship: IEntity, ecs: ECSManager): void {
    const cannon = ship.components.get(CCannon.id) as CCannon;
    if (cannon !== undefined) {
        if (cannon.isCooldownOver()) {
          cannon.reset();
        }
        else if (cannon.hasBeenActivated) {
          cannon.decrement();
        }
        ecs.addOrUpdateComponentOnEntity(ship, cannon);
    }
  }

  private deleteFrameComponents(ship: IEntity, ecs: ECSManager): void {
    const turn = ship.components.get(CActionTurn.id) as CActionTurn;
    if (turn !== undefined)
      ecs.removeComponentOnEntity(ship, turn);

    const bounce = ship.components.get(CBouncing.id) as CBouncing;
    if (bounce !== undefined)
    {
      if (bounce.isOver()) {
        ecs.removeComponentOnEntity(ship, bounce);
      }
      else {
        bounce.decrement();
      }
    }

    const map = ship.components.get(CMap.id) as CMap;
    if (map !== undefined)
      ecs.removeComponentOnEntity(ship, map);

    /*
    const target = ship.components.get(CTarget.id) as CTarget;
      if (target !== undefined)
        ecs.removeComponentOnEntity(ship, target);
    */
  }

  // Reset collision history for the new frame
  private finalizeCollisions(ecs: ECSManager): void {
    const previousCollisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.PreviousCollisions);
    if (previousCollisionsEntity !== undefined) {
        const previousCollisions = previousCollisionsEntity.components.get('Collisions') as CCollisions;
        previousCollisions.collisions = [];
        ecs.addOrUpdateComponentOnEntity(previousCollisionsEntity, previousCollisions);
    }

    const collisionsEntity = ecs.selectEntityFromId(GameEnityUniqId.Collisions);
    if (collisionsEntity !== undefined) {
        const collisions = collisionsEntity.components.get('Collisions') as CCollisions;
        collisions.collisions = [];
        ecs.addOrUpdateComponentOnEntity(collisionsEntity, collisions);
    }
  }

  private finalizeMissiles(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CMissile.id]);
    for (let missile of entities) {
        this.destroyMissile(missile, ecs);
    }
  }

  private destroyMissile(missile: IEntity, ecs: ECSManager): void {
    const isDead = missile.components.get(CIgnore.id) as CIgnore;
    if (isDead !== undefined) {
        ecs.removeEntity(missile.name);
    }
  }

  private destroyShip(ship: IEntity, ecs: ECSManager): void {
    const isDead = ship.components.get(CIgnore.id) as CIgnore;
    if (isDead !== undefined) {
      ecs.removeEntity(ship.name);
    }
  }

  private finalizeFrame(ecs: ECSManager): void {
    let timeFrameEntity = ecs.selectEntityFromId(GameEnityUniqId.TimeFrame);
    if (timeFrameEntity !== undefined) {
      let timeFrame = timeFrameEntity.components.get(CTimeFrame.id) as CTimeFrame;
      timeFrame.frame = timeFrame.frame + 1;
      ecs.addOrUpdateComponentOnEntity(timeFrameEntity, timeFrame);
    }
  }
}