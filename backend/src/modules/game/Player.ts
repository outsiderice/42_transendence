import { Socket } from "dgram";

export	class	Player {
	id:	number;
	webSocket: Socket;
	nick: string;
	userName: string;
	side: number;

	constructor (id: number, webSocket: Socket, nick: string, userName: string, side: number) {
		this.id = id;
		this.webSocket = webSocket;
		this.nick = nick;
		this.userName = userName;
		this.side = side;
	}
}