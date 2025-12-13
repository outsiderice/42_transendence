import { Pong } from "./Pong";

window.addEventListener("load", () => {
    const game = new Pong(800, 600);
    game.start();
});