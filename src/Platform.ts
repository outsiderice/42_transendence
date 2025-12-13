export class Platform {
	moveUp: boolean = false;
	moveDown: boolean = false;
	// position --- x: fixed
	private x: number;
	private y: number;

	// up and down movement boundaries (centered coordinate system)
	//private	minY: number;
	//private maxY: number;

	//size
	private padelHeight: number;
	private padelWidth: number;
	private padelSpeed: number;

	constructor(x: number, y: number, width: number = 10, height: number = 50, speed: number = 5 ) {
		this.x = x;
		this.y = y;
		//this.maxY = halfFieldHeight - height / 2;
		//this.minY = -halfFieldHeight + height
		this.padelWidth = width;
		this.padelHeight = height;
		this.padelSpeed = speed;
	}
	getY(): number {
		return (this.y);
	}

	getX(): number {
		return (this.x);
	}

	getPadelHeight() : number {
		return (this.padelHeight);
	}

	getPadelWidth() : number {
		return (this.padelWidth);
	}

	getPadelSpeed(): number {
		return (this.padelSpeed);
	}

	setY(num: number): void {
		this.y = num;
	}
	update(maxY: number, minY: number): void{
		if (this.moveUp){
			this.y += this.padelSpeed
			if (this.y > maxY) {
				this.y = maxY;
			}
		}
		if (this.moveDown){
			this.y -= this.padelSpeed
			if (this.y < minY) {
				this.y = minY;
			}
		}
	}
}