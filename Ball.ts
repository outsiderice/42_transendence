export class Ball {
	// position
	x: number;
	y: number;

	//size
	radius: number;

	//movement
	speedX: number;
	speedY: number;

	constructor() {
		this.x = 400;
		this.y = 300;
		this.radius = 10;

		//initial movement
		this.speedY = 4;
		this.speedX = 4;
	}
}

// class methods

update()
draw()
reset()