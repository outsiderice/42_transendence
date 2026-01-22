export	class	Player {
	id:	number;
	webSocket: number;
	nick: string;
	userName: string;
	side: string;

	constructor (id: number, webSocket: number, nick: string, userName: string, side: string) {
		this.id = id;
		this.webSocket = webSocket;
		this.nick = nick;
		this.userName = userName;
		this.side = side;
	}
}