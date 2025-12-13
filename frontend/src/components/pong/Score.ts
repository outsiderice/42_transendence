export class Score {
	private leftScore: number;
	private rightScore: number;
	private maxScore: number;

	constructor() {
		this.leftScore = 0;
		this.rightScore = 0;
		this.maxScore = 10;
	}

	getLeftScore(): number {
		return (this.leftScore);
	}

	getRightScore(): number {
		return (this.rightScore);
	}

	addPoint(side: "left" | "right"): void {
		if (side === "left")
			this.leftScore++;
		else if (side === "right")
			this.rightScore++;
	}

	isMaxScoreReached(): boolean {
    	if (this.leftScore === this.maxScore || this.rightScore === this.maxScore)
			return true;
		return false;
	}
	
	whoWon(): string {
		if (this.leftScore === this.maxScore)
			return "left";
		return "right";
	}
}