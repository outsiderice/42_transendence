export class Ball {
	// position
	private x: number;
	private y: number;

	//private	minY: number;
	//private maxY: number;
	//private minX: number;
	//private	maxX: number;

	//ball size
	private radius: number;

	//movement
	private	speedX: number;
	private	speedY: number;

	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.radius = radius;

		//initial movement - random in future needed for x and y
		this.speedY = 7;
		this.speedX = 4;
	}

	//nuevo saque
	reset(side: "left" | "right"): void {

	}

	setX(pos: number): void {
		this.x = pos;
	}

	setY(pos: number): void {
		this.y = pos;
	}

	getX(): number {
		return (this.x);
	}

	getY(): number {
		return (this.y);
	}

	getRadius(): number {
		return (this.radius);
	}

	getSpeedY(): number {
		return (this.speedY);
	}

	getSpeedX(): number {
		return (this.speedX)
	}

	update( minY: number, maxY: number): void {
		this.x += this.speedX;
		this.y += this.speedY;
		
		if (this.y > maxY) {
			this.y = maxY;
			this.bounceX();
		}
		else if (this.y < minY ) {
			this.y = minY;
			this.bounceX();
		}	
	}

	// horizontal walls
	bounceX(): void {
		this.speedY *= -1;
	}

	//paddle -- angle change can be added for more fun
	bounce(speedX: number, speedY:number): void {
		this.speedX = speedX;
		this.speedY = speedY;
	}
}