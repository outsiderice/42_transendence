import { GameState } from "./GameState";

export class Renderer {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas not supported");
        this.ctx = context;
    }

    draw(gameState: GameState): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ball
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(
            gameState.ball.x + this.canvas.width / 2,
            this.canvas.height / 2 - gameState.ball.y,
            gameState.ball.radius,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.closePath();

        // Draw paddles
        this.drawPaddle(gameState.leftPaddle);
        this.drawPaddle(gameState.rightPaddle);

        // Draw scores
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${gameState.score.left}`, this.canvas.width / 4, 50);
        this.ctx.fillText(`${gameState.score.right}`, (this.canvas.width / 4) * 3, 50);
    }

    private drawPaddle(paddle: { x: number; y: number; width: number; height: number }): void {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
            paddle.x + this.canvas.width / 2 - paddle.width / 2,
            this.canvas.height / 2 - paddle.y - paddle.height / 2,
            paddle.width,
            paddle.height
        );
    }
}