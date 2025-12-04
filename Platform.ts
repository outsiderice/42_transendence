export class Platform {
	// position x: always fixed, y: moving depending on key or ball in  case 
	private x: number;
	private y: number;

	//size
	private height: number;
	private width: number;

	private speed: number;

	// possible boolean to control doble bounce Jose suggestion

	constructor() {
		this.x = 400;
		this.y = 300;
		this.height = 50;
		this.width = 10;
	}


}