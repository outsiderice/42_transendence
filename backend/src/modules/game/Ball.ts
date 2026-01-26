export class Ball {
	// position
	private x: number;
	private y: number;

	//ball size
	private radius: number;

	//movement
	private	speed: number;
	// it is not an actual speed, but a direction to go
	private	speedX: number;
	private	speedY: number;
	private maxSpeedRatio: number = 1;

	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = 20;
		this.reset(); // reset the ball start side and y height
		this.speedY = 7;//Math.random();
		this.speedX = 4;
	}

	//nuevo saque
	reset(): void {
		this.x = 0; 
		// Math.random gives a number range between 0 and 1, this way y can be between -0.5 and +0.5 for y
		this.y = (Math.random() - 0.5) * 300;
		// left or right
		const directionX = Math.random() > 0.5 ? 1 : -1;
		this.speedX = 4 * directionX;
		//randomize vertical angle range -3 to +3px
		this.speedY = (Math.random() - 0.5) * 6;
		this.speed = 20;
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

	setSpeed(speed: number) {
		this.speed = speed;
	}

	setSpeedY(speed: number) {
		this.speedY = speed;
	}

	setSpeedX(speed: number) {
		this.speedX = speed;
	}

	getSpeedY(): number {
		return (this.speedY);
	}

	getSpeedX(): number {
		return (this.speedX)
	}

	update( minY: number, maxY: number): void {
		// this calculates hipotenusa (norm for vectors) h^2 = x^2 + y^2 then requires square root
		const	norm = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
		// this rescales, we dont want the ball to go speedx and speedy, but in their direction * by speed
		// and / by norm to normalize the vector to 1
		this.x += this.speedX * Math.sqrt(this.speed) / norm;
		this.y += this.speedY * Math.sqrt(this.speed) / norm;
		
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

	absoluteValue(num: number): number{
		if (num > 0)
			return num;
		return -num;
	}


	//paddle -- angle change can be added for more fun
	bounce(speedX: number, speedY:number): void {
		// if targent is bigger than permitted (in this case 1, which is 45 degrees)
		if (this.absoluteValue(speedY / speedX) > this.maxSpeedRatio){
			speedY = speedY / this.absoluteValue(speedY) * this.absoluteValue(speedX);
			speedY *= this.maxSpeedRatio;
		}
		this.speedX = speedX;
		this.speedY = speedY;
	}
}