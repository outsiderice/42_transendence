export class Platform {
	// position --- x: always fixed, y: moving depending on pressed key
	private x: number;
	private y: number;

	//size
	private height: number;
	private width: number;
	private speed: number;

	constructor(x: number, y: number, width: number = 10, height: number = 50, speed: number = 5 ) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
	}
	getPosition(): number {
		return (this.y);
	}
	moveUp() {
		this.y += this.speed;
	}
	moveDowm(){
		this.y -= this.speed;
	}
}