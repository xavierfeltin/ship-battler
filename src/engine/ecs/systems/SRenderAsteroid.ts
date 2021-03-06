import { Vect2D } from '../../utils/Vect2D';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CRenderer } from '../components/CRenderer';
import { ISystem } from '../ISystem';
import { CAsteroid } from '../components/CAsteroid';
import { CRigidBody } from '../components/CRigidBody';

export class SRenderAsteroid implements ISystem {
  public id = 'RenderAsteroid';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CAsteroid.id, CPosition.id, CRigidBody.id, CRenderer.id]);

    for (let entity of entities) {
        const pos = entity.components.get(CPosition.id) as CPosition;
        const renderer = entity.components.get(CRenderer.id) as CRenderer;
        this.render(pos.value, renderer);

        const rb = entity.components.get(CRigidBody.id) as CRigidBody;
        this.renderRigidBody(pos.value, rb.radius, renderer);
    }
  }

  private render(pos: Vect2D, renderer: CRenderer) {
    const x = (pos.x + 0.5) | 0; //rounded with a bitwise or
    const y = (pos.y + 0.5) | 0;

    let ctx = renderer.attr.ctx;
    const sprite = new Image();
    sprite.src = renderer.attr.sprite || "";
    const w = renderer.attr.width || 1; //resize the sprite
    const h = renderer.attr.height || 1;
    const transX = (w / 2 + 0.5) | 0;
    const transY = (h / 2 + 0.5) | 0;

    ctx.save(); // save current state
    ctx.translate(x - transX, y - transY); // move to desired point

    // go to center for rotation
    ctx.translate(transX, transY);
    ctx.drawImage(sprite, -transX, -transY, w, h); // draws the sprite

    ctx.restore(); // restore original states (no rotation etc)
  }

  private renderRigidBody(pos: Vect2D, radius: number, renderer: CRenderer) {
    const x = (pos.x + 0.5) | 0; //rounded with a bitwise or
    const y = (pos.y + 0.5) | 0;

    let ctx = renderer.attr.ctx;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#E10600';
    ctx.stroke();
  }
}