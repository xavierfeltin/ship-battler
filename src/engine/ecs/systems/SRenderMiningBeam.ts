import { Vect2D } from '../../utils/Vect2D';
import { ECSManager } from '../ECSManager';
import { CPosition } from '../components/CPosition';
import { CRenderer } from '../components/CRenderer';
import { ISystem } from '../ISystem';
import { CMissile } from '../components/CMissile';
import { CMiningBeam } from '../components/CMiningBeam';
import { CTarget } from '../components/CTarget';

export class SRenderMiningBeam implements ISystem {
  public id = 'RenderMiningBeam';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  onUpdate(ecs: ECSManager): void {
    const entities = ecs.selectEntitiesFromComponents([CMiningBeam.id, CPosition.id, CTarget.id, CRenderer.id]);

    for (let entity of entities) {
        const pos = entity.components.get(CPosition.id) as CPosition;
        const target = entity.components.get(CTarget.id) as CTarget;
        const renderer = entity.components.get(CRenderer.id) as CRenderer;
        this.render(pos.value, target.value, renderer);
    }
  }

  private render(pos: Vect2D, target: Vect2D, renderer: CRenderer) {
    const origX = (pos.x + 0.5) | 0; //rounded with a bitwise or
    const origY = (pos.y + 0.5) | 0;

    const targetX = (pos.x + 0.5) | 0; //rounded with a bitwise or
    const targetY = (pos.y + 0.5) | 0;

    let ctx = renderer.attr.ctx;
    ctx.beginPath();
    ctx.moveTo(origX, origY);
    ctx.lineTo(targetX, targetY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ADD8E6';
    ctx.stroke();
  }
}