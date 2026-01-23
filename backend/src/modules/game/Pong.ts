import { Platform } from "./Platform.js";
import { Score } from "./Score.js";
import { Ball } from "./Ball.js";
import type { GameState } from "./GameState.js" 

export	class Pong {
	// field
	height: number;
	heightLimitPaddle: number;
	width: number;

	// paddle distribution
	paddleMargin: number = 20;
	paddlePosX: number;

	// Game elements
	ball: Ball;
	leftPaddle: Platform;
	rightPaddle: Platform;
	score: Score;

	constructor (width: number, height: number) {
		this.height = height;
		this.width = width;
		this.paddlePosX = this.width / 2 - this.paddleMargin;
		this.ball = new Ball(0, 0, 5);
		this.leftPaddle = new Platform(- this.paddlePosX, 0 , 10, 50, 5);
		this.rightPaddle = new Platform(this.paddlePosX, 0, 10, 50, 5);
		this.heightLimitPaddle = this.height/2 - this.leftPaddle.getPadelHeight()/2;
		this.score = new Score();

	}

	handleInput(key: string, isPressed: boolean) {
		if (key === 'w' || key === 'W')
			this.leftPaddle.moveUp = isPressed;
		if (key === "s" || key === "S")
            this.leftPaddle.moveDown = isPressed;
		if (key === "ArrowUp")
            this.rightPaddle.moveUp = isPressed;
		if (key === "ArrowDown")
            this.rightPaddle.moveDown = isPressed;
	}
	// web sockets in future
	/*private setupControls(): void {
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
	}*/

	handlePaddleBallContact(paddle: Platform ): void {
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
				const	newSpeedX = this.ball.getX() - paddle.getX();
				const	newSpeedY = this.ball.getY() - paddle.getY();
				this.ball.bounce(newSpeedX, newSpeedY);
			}
		}	
	}

	handleScore() {
		const	ballX = this.ball.getX();

		if (ballX > this.width/2) {
			this.score.addPoint("left");
			this.ball.reset();
		}
		else if (ballX < - this.width/2) {
			this.score.addPoint("right");
			this.ball.reset();
		}
	}

	handleBallContacts(): void {
		this.handlePaddleBallContact(this.leftPaddle);
		this.handlePaddleBallContact(this.rightPaddle);
		this.handleScore();
	}

	// need proper signal handling
	endGame(): boolean {
		if (this.score.isMaxScoreReached()) {
			return (true);
		}
		return (false);
	}

	update() {
		this.ball.update( - this.height/2, this.height/2);
		this.handleBallContacts();
		this.leftPaddle.update(this.heightLimitPaddle, - this.heightLimitPaddle);
		this.rightPaddle.update(this.heightLimitPaddle, - this.heightLimitPaddle); 
	}

	getGameState() :GameState {
		return {
			ball: { x: this.ball.getX(), y: this.ball.getY(), radius: this.ball.getRadius() },
			leftPaddle: { x: this.leftPaddle.getX(), y: this.leftPaddle.getY(), width: this.leftPaddle.getPadelWidth(), height: this.leftPaddle.getPadelHeight() },
			rightPaddle: { x: this.rightPaddle.getX(), y: this.rightPaddle.getY(), width: this.rightPaddle.getPadelWidth(), height: this.rightPaddle.getPadelHeight() },
			score: { left: this.score.getLeftScore(), right: this.score.getRightScore() }
		};
	}

	//cleanup(): void {
	//	window.removeEventListener("keydown", this.setupControls);
	//}
}