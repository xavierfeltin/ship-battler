import { Vect2D } from '../../utils/Vect2D';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CRenderer } from '../components/CRenderer';
import { ISystem } from '../ISystem';
import { CMiningBeam } from '../components/CMiningBeam';
import { CShip } from '../components/CShip';
import { CRigidBody } from '../components/CRigidBody';
import { COrientation } from '../components/COrientation';
import { MyMath } from '../../utils/MyMath';

export class SRenderMiningBeam implements ISystem {
  public id = 'RenderMiningBeam';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const ships = ecs.selectEntitiesFromComponents([CShip.id, CRigidBody.id, COrientation.id, CMiningBeam.id, CPosition.id]);

    for (let ship of ships) {
        const miningBeam: CMiningBeam = ship.components.get(CMiningBeam.id) as CMiningBeam;
        let pos = ship.components.get(CPosition.id) as CPosition;
        const rigidBody = ship.components.get(CRigidBody.id) as CRigidBody;
        const orientation = ship.components.get(COrientation.id) as COrientation;

        const angleInRadian = MyMath.degreeToRadian(orientation.angle);
        const beamOrigin = new Vect2D(
          pos.value.x + rigidBody.radius * Math.cos(angleInRadian),
          pos.value.y + rigidBody.radius * Math.sin(angleInRadian)
        );

        const target = miningBeam.target;
        const renderer = ship.components.get(CRenderer.id) as CRenderer;
        this.render(beamOrigin, target, renderer);
    }
  }

  private render(pos: Vect2D, target: Vect2D, renderer: CRenderer) {
    const origX = (pos.x + 0.5) | 0; //rounded with a bitwise or
    const origY = (pos.y + 0.5) | 0;

    const targetX = (target.x + 0.5) | 0; //rounded with a bitwise or
    const targetY = (target.y + 0.5) | 0;

    let ctx = renderer.attr.ctx;
    ctx.beginPath();
    ctx.moveTo(origX, origY);
    ctx.lineTo(targetX, targetY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ADD8E6';
    ctx.stroke();
  }
}