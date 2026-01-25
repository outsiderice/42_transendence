import type { GameState } from "./GameState";

export class Renderer {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas not supported");
        this.ctx = context;
    }

    draw(gameState: GameState, leftName: string, rightName: string): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Background
        this.ctx.fillStyle = "#0d0221";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw middle line
        this.drawNet();

        // draw ball
        //this.ctx.shadowBlur = 15;
        //this.ctx.shadowColor = "#ffff00";
        this.ctx.fillStyle = "#ffff00";
        this.ctx.beginPath();
        this.ctx.arc(
            gameState.ball.x + this.canvas.width / 2,
            this.canvas.height / 2 - gameState.ball.y,
            gameState.ball.radius,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        //this.ctx.closePath();

        // Draw paddles
        this.drawPaddle(gameState.leftPaddle, "#00f2ff");
        this.drawPaddle(gameState.rightPaddle, "#ff00ff");

        // Draw Names and Points
        this.drawUI(gameState, leftName, rightName);
    }

    private drawNet() {
        this.ctx.strokeStyle = "rgba(112, 102, 119, 0.5)";
        this.ctx.setLineDash([10, 15]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset dash
    }

    private drawUI(gameState: GameState, leftName: string, rightName: string) {
        //this.ctx.shadowBlur = 10;
        this.ctx.textAlign = "center";

        // Left Player Info
        //this.ctx.shadowColor = "#00f2ff";
        this.ctx.fillStyle = "#00f2ff";
        this.ctx.font = "italic 20px 'Courier New', Courier, monospace";
        this.ctx.fillText(leftName.toUpperCase(), this.canvas.width / 4, 35);
        this.ctx.font = "bold 50px 'Courier New'";
        this.ctx.fillText(`${gameState.score.left}`, this.canvas.width / 4, 85);

        // Right Player Info
        //this.ctx.shadowColor = "#ff00ff";
        this.ctx.fillStyle = "#ff00ff";
        this.ctx.font = "italic 20px 'Courier New'";
        this.ctx.fillText(rightName.toUpperCase(), (this.canvas.width / 4) * 3, 35);
        this.ctx.font = "bold 50px 'Courier New'";
        this.ctx.fillText(`${gameState.score.right}`, (this.canvas.width / 4) * 3, 85);

        this.ctx.shadowBlur = 0; // Reset blur for other elements
    }

    private drawPaddle(paddle: { x: number; y: number; width: number; height: number }, color: string): void {
        //this.ctx.shadowBlur = 20;
        //this.ctx.shadowColor = color;
        this.ctx.fillStyle = color; 
        this.ctx.fillRect(
            paddle.x + this.canvas.width / 2 - paddle.width / 2,
            this.canvas.height / 2 - paddle.y - paddle.height / 2,
            paddle.width,
            paddle.height
        );
        //this.ctx.shadowBlur = 0;
    }
}