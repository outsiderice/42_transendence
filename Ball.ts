export class Ball {
	// position
	x: number;
	y: number;

	//ball size
	radius: number;

	//movement
	speedX: number;
	speedY: number;

	constructor() {
		this.x = 0;
		this.y = 0;
		this.radius = 10;

		//initial movement
		this.speedY = 4;
		this.speedX = 4;
	}
	reset(side: "left" | "right"): void {

	}
	update(): void {
		this.x += this.speedX;
		this.y += this.speedY;
	}

	bounceX(): void {
		this.s
	}

	bounceY(): void {
		
	}
}