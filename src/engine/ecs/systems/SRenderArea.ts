import { ISystem } from '../ISystem';
import { ECSManager } from '../ECSManager';
import { CRenderer } from '../components/CRenderer';
import { GameEnityUniqId } from '../../GameEngine';

export class SRenderArea implements ISystem {
  public id = 'RenderArea';
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
}

  onUpdate(ecs: ECSManager): void {
    const renderer = ecs.selectEntityFromId(GameEnityUniqId.Area)?.components.get(CRenderer.id) as CRenderer;

    const x = 0;
    const y = 0;
    const w = renderer.attr.width || 0;
    const h = renderer.attr.height || 0;
    const ctx = renderer.attr.ctx;

    ctx.clearRect(x, y, w, h);
    ctx.save(); // save current state
    ctx.canvas.height = h;
    ctx.canvas.width = w;
    ctx.fillStyle = renderer.attr.color || "red";
    ctx.fillRect(x, y, w, h);
    ctx.restore(); // restore original states (no rotation etc)
  }
}