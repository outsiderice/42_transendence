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
		this.speedY = 4;
		this.speedX = 4;

		//this.minY = - halfFieldHeight + this.radius;
		//this.maxY = - this.minY;
		//this.minX = - halfFieldWidth + this.radius;
		//this.maxX = - this.minX;
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

	/*update(): void {
		if (this.x + this.speedX > this.maxX) {

		}
		else if (this.x + this.speedX < this.minX ) {

		}
		else {
			this.x += this.speedX;
		}

		if (this.y + this.speedY > this.maxY) {

		}
		else if (this.y + this.speedY < this.minY ) {

		}
		else {
			this.y += this.speedY;
		}

		
	}*/

	// horizontal walls
	bounceX(): void {
		this.speedY *= -1;
	}

	//paddle -- angle change can be added for more fun
	bounceY(): void {
		this.speedX *= -1;
	}
}