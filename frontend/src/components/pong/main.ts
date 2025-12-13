import { Pong } from "./Pong";
const   canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

window.addEventListener("load", () => {

    const game = new Pong(800, 600, canvas);
    game.start();
});