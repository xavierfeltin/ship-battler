import { useCallback, useEffect, useRef, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';

export interface RendererProps {
    width: number;
    height: number;
};

export function GameRenderer({ width, height }: RendererProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [engine, setEngine] = useState<GameEngine | null>(null);
    const interval = 1000 / 60; // 60fps

    const runGame = useCallback(() => {
        console.log("run game !");
        engine?.init();

        setInterval(() => {
            engine?.update();
        }, interval);
    }, [interval, engine]);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        if (!engine)
        {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                setEngine(new GameEngine(ctx));
            }
            else {
                console.error("Could not create the 2D context for rendering the game");
            }
        }
        else {
            runGame();
        }
    }, [runGame, engine]);

    return (
        <div>
            <canvas id="id-game-screen" width={width} height={height} ref={canvasRef} />
        </div>
    );
}