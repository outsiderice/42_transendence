import { Platform } from "./Platform";
import { Score } from "./Score";
import { Ball } from "./Ball";

export	class Pong {
	// field
	height: number;
	heightLimitPaddle: number;
	width: number;

	paddleMargin: number = 10;
	paddlePosX: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	// Game elements
	ball: Ball;
	leftPaddle: Platform;
	rightPaddle: Platform;
	score: Score;

	constructor (width: number, height: number) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		
		document.body.appendChild(this.canvas);

		const context = this.canvas.getContext("2d");
    	if (!context) throw new Error("Canvas not supported");
    	this.ctx = context;
		
		this.height = height;
		
		this.width = width;
		this.paddlePosX = this.width / 2 - this.paddleMargin;
		
		this.ball = new Ball(0, 0, 5);
		this.leftPaddle = new Platform(- this.paddlePosX, 0 , 10, 50, 5);
		this.rightPaddle = new Platform(this.paddlePosX, 0, 10, 50, 5);
		this.heightLimitPaddle = this.height/2 - this.leftPaddle.getPadelHeight()/2;
		this.score = new Score();

	}

	private setupControls(): void {
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			const key = event.key;
			if (key === "w" || key === "W") {
            	this.leftPaddle.moveUp = true;
        	}
        	if (key === "s" || key === "S") {
            	this.leftPaddle.moveDown = true;
				console.log("Bajando bajando");
        	}
        	if (key === "ArrowUp") {
            	this.rightPaddle.moveUp = true;
        	}
        	if (key === "ArrowDown") {
            	this.rightPaddle.moveDown = true;
        	}
		});

		window.addEventListener("keyup", (event: KeyboardEvent) => {
			const key = event.key;
			if (key === "w" || key === "W") {
            	this.leftPaddle.moveUp = false;
        	}
        	if (key === "s" || key === "S") {
            	this.leftPaddle.moveDown = false;
        	}
        	if (key === "ArrowUp") {
            	this.rightPaddle.moveUp = false;
        	}
        	if (key === "ArrowDown") {
            	this.rightPaddle.moveDown = false;
        	}
		});
	}

	handlePaddleBallContact(paddle: Platform): void {
		const	topPaddle = paddle.getY() + paddle.getPadelHeight()/2;
		const	botPaddle = paddle.getY() - paddle.getPadelHeight()/2;
		const	topBall = this.ball.getY() + this.ball.getRadius();
		const	botBall = this.ball.getY() - this.ball.getRadius();
		const	leftPaddle = paddle.getX() - paddle.getPadelWidth()/2;
		const	rightPaddle = paddle.getX() + paddle.getPadelWidth()/2;
		const	leftBall = this.ball.getX() - this.ball.getRadius();
		const	rightBall = this.ball.getX() + this.ball.getRadius();

		if (leftBall <= rightPaddle  && leftPaddle <= rightBall) {
			if (topBall >= botPaddle && botBall <= topPaddle) {
				this.ball.bounce(this.ball.getSpeedX() * (-1), this.ball.getSpeedY());

			}

		}
		
	}

	

	handleBallContacts(): void {
		this.handlePaddleBallContact(this.leftPaddle);
		this.handlePaddleBallContact(this.rightPaddle);

	}

	update() {
		this.ball.update( - this.height/2, this.height/2);
		this.handleBallContacts();
		this.leftPaddle.update(this.heightLimitPaddle, - this.heightLimitPaddle);
		this.rightPaddle.update(this.heightLimitPaddle, - this.heightLimitPaddle); 
	}

	// Platform

	// Ball
	private draw(): void {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw the ball
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.arc(
			this.ball.getX() + this.canvas.width / 2,  // convert center-based coordinates
			this.canvas.height / 2 - this.ball.getY(), // invert y-axis if center=0,0
			this.ball.getRadius(),
			0,
			Math.PI * 2
		);
		this.ctx.fill();
		this.ctx.closePath();

		// Draw left paddle
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(
			this.leftPaddle.getX() + this.canvas.width / 2 - this.leftPaddle.getPadelWidth() / 2,
			this.canvas.height / 2 - this.leftPaddle.getY() - this.leftPaddle.getPadelHeight() / 2,
			this.leftPaddle.getPadelWidth(),
			this.leftPaddle.getPadelHeight()
		);

		// Draw right paddle
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(
			this.rightPaddle.getX() + this.canvas.width / 2 - this.rightPaddle.getPadelWidth() / 2,
			this.canvas.height / 2 - this.rightPaddle.getY() - this.rightPaddle.getPadelHeight() / 2,
			this.rightPaddle.getPadelWidth(),
			this.rightPaddle.getPadelHeight()
		);

		// Optionally, draw scores
		this.ctx.font = "30px Arial";
		this.ctx.fillText(
			`${this.score.getLeftScore()}`,
			this.canvas.width / 4,
			50
		);
		this.ctx.fillText(
			`${this.score.getRightScore()}`,
			(this.canvas.width / 4) * 3,
			50
		);
	}

	private gameLoop = () => {
    	this.update();
    	this.draw();
    	requestAnimationFrame(this.gameLoop);
	}

	start(): void {
    	this.setupControls();
    	requestAnimationFrame(this.gameLoop);
	}
}
